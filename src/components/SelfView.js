import React from "react";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  root: {
    marginTop: 20,
    height: 500,
    backgroundColor: "#ecf0f1",
    borderRadius: 4,
    width: 680,
  },
});

export default function SelfView() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <canvas id="canvas"></canvas>
      <video id="video"></video>
    </div>
  );
}
