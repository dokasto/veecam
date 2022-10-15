import React from "react";

const ColorCorrectionContext = React.createContext({
  blur: 0,
  saturation: 0,
  brightness: 0,
  contrast: 0,
  exposure: 0,
  setBlur: () => {},
  setSaturation: () => {},
  setBrightness: () => {},
  setContrast: () => {},
  setExposure: () => {},
});

export default ColorCorrectionContext;
