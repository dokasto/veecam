import React from "react";

const ColorCorrectionContext = React.createContext({
  blur: 0,
  hue: 0,
  saturation: 0,
  brightness: 0,
  contrast: 0,
  exposure: 0,
  setBlur: () => {},
  setHue: () => {},
  setSaturation: () => {},
  setBrightness: () => {},
  setContrast: () => {},
  setExposure: () => {},
});

export default ColorCorrectionContext;
