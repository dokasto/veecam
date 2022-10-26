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

window.dataLayer = window.dataLayer || [];
function gtag() {
  try {
    dataLayer.push(arguments);
  } catch (e) {
    console.info(e);
  }
}
gtag("js", new Date());
gtag("config", "G-YSB1Z3YLZH");

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

  const onVirtualCamSelected = useCallback((err) => {
    gtag("event", "camera_selected", {
      event_category: "engagement",
      event_label: "Camera Selected",
      value: err == null ? "successful" : "error",
    });
  }, []);

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
