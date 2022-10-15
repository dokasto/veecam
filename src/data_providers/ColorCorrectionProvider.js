import React, { useMemo, useState } from "react";
import ColorCorrectionContext from "./ColorCorrectionContext";
import PropTypes from "prop-types";

export default function ColorCorrectionProvider({ children }) {
  const [blur, setBlur] = useState(0);
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [exposure, setExposure] = useState(0);
  const value = useMemo(
    () => ({
      blur,
      hue,
      saturation,
      brightness,
      contrast,
      exposure,
      setBlur,
      setHue,
      setSaturation,
      setBrightness,
      setContrast,
      setExposure,
    }),
    [blur, brightness, contrast, exposure, hue, saturation]
  );

  return (
    <ColorCorrectionContext.Provider value={value}>
      {children}
    </ColorCorrectionContext.Provider>
  );
}

ColorCorrectionProvider.propTypes = {
  children: PropTypes.node,
};
