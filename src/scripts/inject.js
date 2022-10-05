"use strict";

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

monkeyPatchEnumerateDevices(VIRTUAL_DEVICE);
monkeyPatchGetUserMedia(VIRTUAL_DEVICE.deviceId);

console.log("VeeCam Installed");
