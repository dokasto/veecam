import React, { useRef, useCallback, useState } from "react";
import { createRoot } from "react-dom/client";
import useRenderStreamToOfflineCanvas from "../hooks/useRenderStreamToOfflineCanvas";
import { EXTENSION_SCRIPT_TAG_ID } from "../constants";

import {
  generateUniqueID,
  monkeyPatchEnumerateDevices,
  monkeyPatchGetUserMedia,
} from "./helper.js";
import useGALogger from "../hooks/useGALogger";

const VIRTUAL_DEVICE = {
  deviceId: generateUniqueID(),
  groupId: generateUniqueID(),
  label: "VeeCam Virtual Webcam",
  kind: "videoinput",
};

function Root({ prefs }) {
  monkeyPatchEnumerateDevices(VIRTUAL_DEVICE);

  const [mediaStream, setMediaStream] = useState(null);
  const shouldStart = useRef(false);
  const { logVirtualCameraUsage } = useGALogger();
  // create offscreen canvas
  const canvasRef = useRef(document.createElement("canvas"));

  useRenderStreamToOfflineCanvas(
    canvasRef.current,
    mediaStream,
    prefs.colorCorrectionPrefs,
    prefs.chromeExtensionBase,
    shouldStart.current
  );

  const onMediaStreamRequest = useCallback((stream) => {
    setMediaStream(stream);
  }, []);

  const onVirtualCamSelected = useCallback(() => {
    shouldStart.current = true;
    logVirtualCameraUsage();
  }, [logVirtualCameraUsage]);

  monkeyPatchGetUserMedia(
    VIRTUAL_DEVICE.deviceId,
    prefs.devicePrefs,
    onMediaStreamRequest,
    canvasRef.current,
    onVirtualCamSelected
  );
}

try {
  const div = document.createElement("div");
  document.getElementsByTagName("body")[0]?.appendChild(div);
  const root = createRoot(div);
  const script = document.getElementById(EXTENSION_SCRIPT_TAG_ID);
  const prefs = script.getAttribute("prefs");
  root.render(<Root prefs={JSON.parse(prefs)} />);
} catch (e) {
  console.info(e, " could not start VeeCam");
}
