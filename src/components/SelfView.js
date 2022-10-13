import React, { useRef } from "react";
import { createUseStyles } from "react-jss";
import { useRenderStreamToCanvas } from "../hooks/canvasHooks";

const useStyles = createUseStyles({
  root: {
    marginTop: 20,
    borderRadius: 4,
    width: 680,
    textAlign: "center",
    overflow: "hidden",
  },
});

export default function SelfView() {
  const classes = useStyles();
  const canvasRef = useRef(null);
  useRenderStreamToCanvas(canvasRef.current);

  return (
    <div className={classes.root}>
      <canvas ref={canvasRef} id="canvas"></canvas>
    </div>
  );
}
