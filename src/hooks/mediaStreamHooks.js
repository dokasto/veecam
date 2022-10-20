import { useContext, useEffect } from "react";
import MediaDevicesContext from "../data_providers/MediaDevicesContext";
import MediaStreamContext from "../data_providers/MediaStreamContext";
import useErrorLogger from "./useErrorLogger";
import { getStoredDevicePrefs } from "../utils/storage";
import { VIDEO_MEDIA_CONSTRAINT } from "../constants";

export function useFetchMediaStream() {
  const logError = useErrorLogger();
  const { setStream } = useContext(MediaStreamContext);
  const { video, setVideo } = useContext(MediaDevicesContext);

  useEffect(() => {
    async function fetchStream() {
      let exactVideoId;

      if (video == null) {
        const prefs = await getStoredDevicePrefs();
        if (prefs?.video != null) {
          exactVideoId = prefs.video;
        }
      } else {
        exactVideoId = video;
      }

      const constraints = {
        auidio: false,
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          ...(exactVideoId != null && { deviceId: { exact: exactVideoId } }),
        },
      };

      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        const [videoTrack] = stream.getVideoTracks();
        const deviceId = videoTrack.getSettings()?.deviceId;
        if (video == null && exactVideoId == null && deviceId != null) {
          setVideo(deviceId);
        }
        setStream(stream);
      } catch (e) {
        logError("useFetchMediaStream", "Unable to fetch media stream", e);
      }
    }
    fetchStream();
  }, [logError, setStream, setVideo, video]);
}
