import { createUseStyles } from "react-jss";
import React, { useCallback, useContext } from "react";
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

export default function ColorControls() {
  const classes = useStyles();
  const {
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
  } = useContext(ColorCorrectionContext);
  const normalize = useCallback((value) => {
    return value;
  }, []);
  const min = 0.0;
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
          onChange={(e) => setBlur(normalize(e.target.value))}
        />
      </div>
      <div className={classes.control}>
        <label htmlFor="hue">Hue</label>
        <input
          step={step}
          min={min}
          max={max}
          value={hue}
          id="hue"
          type="range"
          onChange={(e) => setHue(normalize(e.target.value))}
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
          onChange={(e) => setSaturation(normalize(e.target.value))}
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
          onChange={(e) => setBrightness(normalize(e.target.value))}
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
          onChange={(e) => setContrast(normalize(e.target.value))}
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
          onChange={(e) => setExposure(normalize(e.target.value))}
        />
      </div>
    </div>
  );
}
