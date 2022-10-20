import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import MediaDevicesContext from "./MediaDevicesContext";
import PropTypes from "prop-types";
import { getStoredDevicePrefs, saveDevicePrefs } from "../utils/storage";
import useErrorLogger from "../hooks/useErrorLogger";

export default function MediaDevicesProvider({ children }) {
  const [devices, _setDevices] = useState([]);
  const [video, _setVideo] = useState(null);
  const [audio, _setAudio] = useState(null);
  const logError = useErrorLogger();
  const hasFetchedStoredData = useRef(false);

  const setDevices = useCallback((deviceList) => {
    _setDevices(deviceList);
  }, []);

  const setVideo = useCallback(
    (videoSourceId) => {
      _setVideo(videoSourceId);
      saveDevicePrefs({ video: videoSourceId, audio });
    },
    [audio]
  );

  const setAudio = useCallback(
    (audioSourceId) => {
      _setAudio(audioSourceId);
      saveDevicePrefs({ video, audio: audioSourceId });
    },
    [video]
  );

  useEffect(() => {
    if (hasFetchedStoredData.current) {
      return;
    }

    getStoredDevicePrefs()
      .then((prefs) => {
        prefs?.video != null && _setVideo(prefs.video);
        prefs?.audio != null && _setAudio(prefs.audio);
        hasFetchedStoredData.current = true;
      })
      .catch((e) => {
        logError(
          "MediaDevicesProvider",
          "failed to fetch stored device prefs",
          e
        );
      });
  }, [logError]);

  const value = useMemo(
    () => ({
      setDevices,
      setVideo,
      video,
      setAudio,
      devices,
      audio,
    }),
    [audio, devices, setAudio, setDevices, setVideo, video]
  );

  return (
    <MediaDevicesContext.Provider value={value}>
      {children}
    </MediaDevicesContext.Provider>
  );
}

MediaDevicesProvider.propTypes = {
  children: PropTypes.node,
};
