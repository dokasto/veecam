import React, { useRef, useEffect, useMemo, useState } from "react";
import ColorCorrectionContext from "./ColorCorrectionContext";
import PropTypes from "prop-types";
import useErrorLogger from "../hooks/useErrorLogger";
import {
  getStoredColorCorrectionPrefs,
  saveColorCorrectionPrefs,
} from "../utils/storage";

const SAVE_DELAY_MS = 300;

export default function ColorCorrectionProvider({ children }) {
  const logError = useErrorLogger();

  const [blur, setBlur] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [exposure, setExposure] = useState(0);

  const [blurRef, setBlurRef] = useState(0);
  const [saturationRef, setSaturationRef] = useState(0);
  const [brightnessRef, setBrightnessRef] = useState(0);
  const [contrastRef, setContrastRef] = useState(0);
  const [exposureRef, setExposureRef] = useState(0);

  const value = useMemo(
    () => ({
      blur,
      saturation,
      brightness,
      contrast,
      exposure,
      setBlur,
      setSaturation,
      setBrightness,
      setContrast,
      setExposure,
      blurRef,
      saturationRef,
      brightnessRef,
      contrastRef,
      exposureRef,
      setBlurRef,
      setSaturationRef,
      setBrightnessRef,
      setContrastRef,
      setExposureRef,
    }),
    [
      blur,
      blurRef,
      brightness,
      brightnessRef,
      contrast,
      contrastRef,
      exposure,
      exposureRef,
      saturation,
      saturationRef,
    ]
  );

  const hasSetInitialStateFromStore = useRef(false);

  useEffect(() => {
    if (hasSetInitialStateFromStore.current) {
      return;
    }

    getStoredColorCorrectionPrefs()
      .then((pref) => {
        pref?.blur != null && setBlur(pref.blur);
        pref?.saturation != null && setSaturation(pref.saturation);
        pref?.brightness != null && setBrightness(pref.brightness);
        pref?.contrast != null && setContrast(pref.contrast);
        pref?.exposure != null && setExposure(pref.exposure);
        hasSetInitialStateFromStore.current = true;
      })
      .catch((e) => {
        logError(
          "ColorCorrectionProvider",
          "failed to fetch stored color correction prefs",
          e
        );
      });
  }, [logError]);

  const lastTime = useRef(null);

  useEffect(() => {
    if (!hasSetInitialStateFromStore.current) {
      return;
    }

    const currentTime = Date.now();

    if (
      lastTime.current != null &&
      currentTime - lastTime.current < SAVE_DELAY_MS
    ) {
      return;
    }

    lastTime.current = currentTime;

    saveColorCorrectionPrefs({
      blur,
      saturation,
      brightness,
      contrast,
      exposure,
    });
  }, [blur, brightness, contrast, exposure, saturation]);

  return (
    <ColorCorrectionContext.Provider value={value}>
      {children}
    </ColorCorrectionContext.Provider>
  );
}

ColorCorrectionProvider.propTypes = {
  children: PropTypes.node,
};
