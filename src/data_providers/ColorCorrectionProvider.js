import React, { useRef, useEffect, useMemo, useState } from "react";
import ColorCorrectionContext from "./ColorCorrectionContext";
import PropTypes from "prop-types";

const KEY = "VEECAM:COLOR_CORRECTION_KEY";
const SAVE_DELAY_MS = 300;

export default function ColorCorrectionProvider({ children }) {
  const [blur, setBlur] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [exposure, setExposure] = useState(0);
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
    }),
    [blur, brightness, contrast, exposure, saturation]
  );

  const hasSetInitialStateFromStore = useRef(false);

  useEffect(() => {
    if (hasSetInitialStateFromStore.current) {
      return;
    }

    // eslint-disable-next-line no-undef
    chrome.storage.sync.get(KEY, function (data) {
      const pref = JSON.parse(data[KEY]);
      pref?.blur != null && setBlur(pref.blur);
      pref?.saturation != null && setSaturation(pref.saturation);
      pref?.brightness != null && setBrightness(pref.brightness);
      pref?.contrast != null && setContrast(pref.contrast);
      pref?.exposure != null && setExposure(pref.exposure);

      hasSetInitialStateFromStore.current = true;
    });
  }, []);

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

    // eslint-disable-next-line no-undef
    chrome.storage.sync.set({
      [KEY]: JSON.stringify({
        blur,
        saturation,
        brightness,
        contrast,
        exposure,
      }),
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
