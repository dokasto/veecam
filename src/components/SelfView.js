import React, { useRef, useContext } from "react";
import { createUseStyles } from "react-jss";
import useRenderStreamToCanvas from "../hooks/useRenderStreamToCanvas";
import MediaStreamContext from "../data_providers/MediaStreamContext";

const useStyles = createUseStyles({
  root: {
    marginTop: 20,
    borderRadius: 4,
    textAlign: "center",
    overflow: "hidden",
    minWidth: 640,
    minHeight: 480,
    backgroundColor: "transparent",
    padding: 0,
  },
});

export default function SelfView() {
  const classes = useStyles();
  const canvasRef = useRef(null);
  const { stream } = useContext(MediaStreamContext);

  useRenderStreamToCanvas(canvasRef.current, stream);

  return (
    <div id="canvas-container" className={classes.root}>
      <canvas ref={canvasRef} id="canvas"></canvas>
    </div>
  );
}
