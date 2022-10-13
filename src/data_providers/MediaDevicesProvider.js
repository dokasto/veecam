import React, { useCallback, useMemo, useState } from "react";
import MediaDevicesContext from "./MediaDevicesContext";
import PropTypes from "prop-types";

export default function MediaDevicesProvider({ children }) {
  const [devices, _setDevices] = useState([]);
  const [video, _setVideo] = useState(null);
  const [audio, _setAudio] = useState(null);

  const setDevices = useCallback((deviceList) => {
    _setDevices(deviceList);
  }, []);

  const setVideo = useCallback((videoSourceId) => {
    _setVideo(videoSourceId);
  }, []);

  const setAudio = useCallback((audioSourceId) => {
    _setAudio(audioSourceId);
  }, []);

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

  MediaDevicesProvider.propTypes = {
    children: PropTypes.node,
  };

  return (
    <MediaDevicesContext.Provider value={value}>
      {children}
    </MediaDevicesContext.Provider>
  );
}
