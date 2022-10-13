import { useContext, useEffect } from "react";
import MediaDevicesContext from "../data_providers/MediaDevicesContext";
import MediaStreamContext from "../data_providers/MediaStreamContext";
import useErrorLogger from "./useErrorLogger";

export function useFetchMediaStream() {
  const logError = useErrorLogger();
  const { setStream } = useContext(MediaStreamContext);
  const { video } = useContext(MediaDevicesContext);

  useEffect(() => {
    const constraints = {
      auidio: false,
      video: {
        width: { ideal: 640 },
        height: { ideal: 480 },
        facingMode: "environment",
        ...(video != null && { deviceId: { exact: video } }),
      },
    };

    async function fetchStream() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        setStream(stream);
      } catch (e) {
        logError("useFetchMediaStream", "Unable to fetch media stream", e);
      }
    }
    fetchStream();
  }, [logError, setStream, video]);
}
