import { createUseStyles } from "react-jss";
import React, { useContext, useCallback, useRef, useEffect } from "react";
import ColorCorrectionContext from "../data_providers/ColorCorrectionContext";

const useStyles = createUseStyles({
  root: {
    padding: "0 20px",
    marginTop: 48,
  },
  control: {
    display: "block",
    padding: 4,
    marginBottom: 28,
    "& label": {
      textTransform: "uppercase",
      display: "block",
      fontWeight: "400",
    },
    "& input": {
      display: "block",
      marginTop: 8,
      width: "100%",
    },
  },
});

const MIN = -1.0;
const MAX = 1.0;
const STEP = 0.01;

export default function ColorControls() {
  const classes = useStyles();
  const {
    blur,
    saturation,
    brightness,
    contrast,
    exposure,
    setBlurRef,
    setBlur,
    setSaturation,
    setBrightness,
    setContrast,
    setExposure,
    setSaturationRef,
    setBrightnessRef,
    setContrastRef,
    setExposureRef,
  } = useContext(ColorCorrectionContext);

  const blurRef = useRef(null);
  const exposureRef = useRef(null);
  const contrastRef = useRef(null);
  const saturationRef = useRef(null);
  const brightnessRef = useRef(null);

  const onBlurChange = (e) => {
    setBlur(e.target.value);
  };

  const onExposureChange = (e) => {
    setExposure(e.target.value);
  };

  const onContrastChange = (e) => {
    setContrast(e.target.value);
  };

  const onBrightnessChange = (e) => {
    setBrightness(e.target.value);
  };

  const onSaturationChange = (e) => {
    setSaturation(e.target.value);
  };

  useEffect(() => {
    if (blurRef != null) {
      setBlurRef(blurRef);
    }

    if (saturationRef != null) {
      setSaturationRef(saturationRef);
    }

    if (brightnessRef != null) {
      setBrightnessRef(brightnessRef);
    }

    if (contrastRef != null) {
      setContrastRef(contrastRef);
    }

    if (exposureRef != null) {
      setExposureRef(exposureRef);
    }
  }, [
    setBlurRef,
    setBrightnessRef,
    setContrastRef,
    setExposureRef,
    setSaturationRef,
  ]);

  const onReset = useCallback(() => {
    setBlur(0);
    setBrightness(0);
    setContrast(0);
    setExposure(0);
    setBlur(0);
    setSaturation(0);
  }, [setBlur, setBrightness, setContrast, setExposure, setSaturation]);

  return (
    <div className={classes.root}>
      <div className={classes.control}>
        <label htmlFor="blur">Background Blur</label>
        <input
          ref={blurRef}
          value={blur}
          step={1}
          min={0}
          max={20}
          id="blur"
          type="range"
          onChange={onBlurChange}
        />
      </div>
      <div className={classes.control}>
        <label htmlFor="exposure">exposure</label>
        <input
          ref={exposureRef}
          step={STEP}
          min={MIN}
          max={MAX}
          value={exposure}
          id="exposure"
          type="range"
          onInput={onExposureChange}
        />
      </div>
      <div className={classes.control}>
        <label htmlFor="contrast">contrast</label>
        <input
          ref={contrastRef}
          step={STEP}
          min={MIN}
          max={MAX}
          value={contrast}
          id="contrast"
          type="range"
          onChange={onContrastChange}
        />
      </div>
      <div className={classes.control}>
        <label htmlFor="saturation">saturation</label>
        <input
          ref={saturationRef}
          step={STEP}
          min={MIN}
          max={MAX}
          value={saturation}
          id="saturation"
          type="range"
          onChange={onSaturationChange}
        />
      </div>
      <div className={classes.control}>
        <label htmlFor="brightness">brightness</label>
        <input
          ref={brightnessRef}
          step={STEP}
          min={MIN}
          max={MAX}
          value={brightness}
          id="brightness"
          type="range"
          onChange={onBrightnessChange}
        />
      </div>
      <button onClick={onReset}>Reset</button>
    </div>
  );
}
