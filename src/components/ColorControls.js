import { createUseStyles } from "react-jss";
import React, { useContext, useMemo } from "react";
import ColorCorrectionContext from "../data_providers/ColorCorrectionContext";
import useDebounce from "../hooks/useDebounce";

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

const DELAY_MS = 200;

export default function ColorControls() {
  const classes = useStyles();
  const {
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
  } = useContext(ColorCorrectionContext);

  // const onBlurChange = (e) => {
  //   console.log(e.target.value);
  //   setBlur(e.target.value);
  // }, DELAY_MS);

  const onBlurChange = useMemo(
    () =>
      debounce((e) => {
        console.log(e.target.value);
        setBlur(e.target.value);
      }, DELAY_MS),
    [setBlur]
  );

  const onExposureChange = useDebounce((e) => {
    setExposure(e.target.value);
  }, DELAY_MS);

  const onContrastChange = useDebounce((e) => {
    console.log(e.target.value);
    setContrast(e.target.value);
  }, DELAY_MS);

  const onBrightnessChange = useDebounce((e) => {
    console.log(e.target.value);
    setBrightness(e.target.value);
  }, DELAY_MS);

  const onSaturationChange = useDebounce((e) => {
    console.log(e.target.value);
    setSaturation(e.target.value);
  }, DELAY_MS);

  const min = -1.0;
  const max = 1.0;
  const step = 0.01;
  return (
    <div className={classes.root}>
      <div className={classes.control}>
        <label htmlFor="blur">Background Blur</label>
        <input
          step={step}
          min={min}
          max={max}
          value={blur}
          id="blur"
          type="range"
          onChange={onBlurChange}
        />
      </div>
      <div className={classes.control}>
        <label htmlFor="exposure">exposure</label>
        <input
          step={step}
          min={min}
          max={max}
          value={exposure}
          id="exposure"
          type="range"
          onChange={onExposureChange}
        />
      </div>
      <div className={classes.control}>
        <label htmlFor="contrast">contrast</label>
        <input
          step={step}
          min={min}
          max={max}
          value={contrast}
          id="contrast"
          type="range"
          onChange={onContrastChange}
        />
      </div>
      <div className={classes.control}>
        <label htmlFor="saturation">saturation</label>
        <input
          step={step}
          min={min}
          max={max}
          value={saturation}
          id="saturation"
          type="range"
          onChange={onSaturationChange}
        />
      </div>
      <div className={classes.control}>
        <label htmlFor="brightness">brightness</label>
        <input
          step={step}
          min={min}
          max={max}
          value={brightness}
          id="brightness"
          type="range"
          onChange={onBrightnessChange}
        />
      </div>
    </div>
  );
}

function debounce(fn, delay) {
  let timeout;
  return function (...args) {
    window.clearTimeout(timeout);
    timeout = window.setTimeout(() => {
      fn(...args);
    }, delay);
  };
}
