import React, { useRef, useCallback, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import useRenderStreamToOfflineCanvas from "../hooks/useRenderStreamToOfflineCanvas";

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

function Root() {
  monkeyPatchEnumerateDevices(VIRTUAL_DEVICE);

  const [mediaStream, setMediaStream] = useState(null);
  const [params, setParams] = useState({
    blur: 4,
    saturation: 0.3,
    brightness: 0.3,
    contrast: 0.3,
    exposure: 0.3,
  });

  // create offscreen canvas
  const canvasRef = useRef(document.createElement("canvas"));
  document.getElementsByTagName("body")[0]?.appendChild(canvasRef.current);

  useRenderStreamToOfflineCanvas(canvasRef.current, mediaStream, params);

  const onMediaStreamRequest = useCallback((stream) => {
    console.log("stream", stream);
    setMediaStream(stream);
  }, []);

  monkeyPatchGetUserMedia(VIRTUAL_DEVICE.deviceId, onMediaStreamRequest);
}

try {
  const div = document.createElement("div");
  document.getElementsByTagName("body")[0]?.appendChild(div);
  const root = createRoot(div);
  root.render(<Root />);
  console.info("VeeCam Installed");
} catch (e) {
  console.error(e, " could not install VeeCam");
}
