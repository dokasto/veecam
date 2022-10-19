import React from "react";

const ColorCorrectionContext = React.createContext({
  blur: 0,
  saturation: 0,
  brightness: 0,
  contrast: 0,
  exposure: 0,
  blurRef: null,
  saturationRef: null,
  brightnessRef: null,
  contrastRef: null,
  exposureRef: null,
  setBlur: () => {},
  setSaturation: () => {},
  setBrightness: () => {},
  setContrast: () => {},
  setExposure: () => {},
  setBlurRef: () => {},
  setSaturationRef: () => {},
  setBrightnessRef: () => {},
  setContrastRef: () => {},
  setExposureRef: () => {},
});

export default ColorCorrectionContext;
