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
    position: "relative",
  },
  background: {
    position: "absolute",
    zIndex: 1,
    backgroundColor: "#000",
    width: "100%",
    height: "97%",
    color: "#fff",
    paddingTop: 50,
    fontWeight: 500,
    fontSize: 20,
    textAlign: "center",
    verticalAlign: "middle",
  },
  canvas: {
    position: "relative",
    zIndex: 2,
  },
});

export default function SelfView() {
  const classes = useStyles();
  const canvasRef = useRef(null);
  const { stream } = useContext(MediaStreamContext);

  useRenderStreamToCanvas(canvasRef.current, stream);

  return (
    <div id="canvas-container" className={classes.root}>
      <div className={classes.background}>
        Loading Camera, please allow access to your camera.
      </div>
      <canvas className={classes.canvas} ref={canvasRef} id="canvas"></canvas>
    </div>
  );
}
