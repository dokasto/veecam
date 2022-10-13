import React from "react";

const MediaDevicesContext = React.createContext({
  devices: null,
  video: null,
  audio: null,
  setDevices: () => {},
  setVideo: () => {},
  setAudio: () => {},
});

export default MediaDevicesContext;
