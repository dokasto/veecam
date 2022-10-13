import { useContext, useEffect, useRef } from "react";
import MediaDevicesContext from "../data_providers/MediaDevicesContext";
import MediaStreamContext from "../data_providers/MediaStreamContext";
import useErrorLogger from "./useErrorLogger";

export default function useFetchMediaDeviceList() {
  const { setDevices } = useContext(MediaDevicesContext);
  const { stream } = useContext(MediaStreamContext);
  const hasFetchedDevices = useRef(false);
  const logError = useErrorLogger();

  useEffect(() => {
    if (hasFetchedDevices.current && stream != null) {
      return;
    }
    hasFetchedDevices.current = true;

    navigator.mediaDevices
      .enumerateDevices()
      .then((deviceList) => {
        setDevices(deviceList.filter((device) => device.deviceId.length > 0));
      })
      .catch((err) => {
        logError("useFetchMediaDeviceList", "Unable to fetch device list", err);
      });
  }, [logError, setDevices, stream]);
}
