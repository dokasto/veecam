import { createUseStyles } from "react-jss";
import React from "react";

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

export default function DisplayControls() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.control}>
        <label htmlFor="blur">Background Blur</label>
        <input id="blur" type="range" />
      </div>
      <div className={classes.control}>
        <label htmlFor="hue">Hue</label>
        <input id="hue" type="range" />
      </div>
      <div className={classes.control}>
        <label htmlFor="saturation">saturation</label>
        <input id="saturation" type="range" />
      </div>
      <div className={classes.control}>
        <label htmlFor="brightness">brightness</label>
        <input id="brightness" type="range" />
      </div>
      <div className={classes.control}>
        <label htmlFor="contrast">contrast</label>
        <input id="contrast" type="range" />
      </div>
      <div className={classes.control}>
        <label htmlFor="exposure">exposure</label>
        <input id="exposure" type="range" />
      </div>
    </div>
  );
}
