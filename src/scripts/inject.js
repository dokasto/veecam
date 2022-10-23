import React, { useRef, useCallback, useState } from "react";
import { createRoot } from "react-dom/client";
import useRenderStreamToOfflineCanvas from "../hooks/useRenderStreamToOfflineCanvas";
import { EXTENSION_SCRIPT_TAG_ID } from "../constants";

import {
  generateUniqueID,
  monkeyPatchEnumerateDevices,
  monkeyPatchGetUserMedia,
} from "./helper.js";

const VIRTUAL_DEVICE = {
  deviceId: generateUniqueID(),
  groupId: generateUniqueID(),
  label: "VeeCam Virtual Webcam",
  kind: "videoinput",
};

function Root({ prefs }) {
  monkeyPatchEnumerateDevices(VIRTUAL_DEVICE);

  const [mediaStream, setMediaStream] = useState(null);

  // create offscreen canvas
  const canvasRef = useRef(document.createElement("canvas"));

  useRenderStreamToOfflineCanvas(
    canvasRef.current,
    mediaStream,
    prefs.colorCorrectionPrefs,
    prefs.chromeExtensionBase
  );

  const onMediaStreamRequest = useCallback((stream) => {
    setMediaStream(stream);
  }, []);

  monkeyPatchGetUserMedia(
    VIRTUAL_DEVICE.deviceId,
    prefs.devicePrefs,
    onMediaStreamRequest,
    canvasRef.current
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
  console.error(e, " could not start VeeCam");
}
