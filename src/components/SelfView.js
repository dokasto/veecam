import React, { useContext, useEffect, useRef } from "react";
import { createUseStyles } from "react-jss";
import MediaStreamContext from "../data_providers/MediaStreamContext";
import { useRenderVideoToCanvas } from "../hooks/canvasHooks";

const useStyles = createUseStyles({
  root: {
    marginTop: 20,
    backgroundColor: "#ecf0f1",
    borderRadius: 4,
    width: 680,
  },
});

export default function SelfView() {
  const classes = useStyles();
  const { stream } = useContext(MediaStreamContext);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const isVideoReady = useRef(false);
  const requestAnimationFrameRef = useRef(null);
  const renderVideoToCanvas = useRenderVideoToCanvas();
  const hasStartedRenderLoop = useRef(false);
  const imageCaptureRef = useRef(null);

  useEffect(() => {
    if (stream != null && videoRef != null) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      isVideoReady.current = true;
      const [track] = stream.getVideoTracks();
      imageCaptureRef.current = new ImageCapture(track);
      imageCaptureRef.current.grabFrame().then((imageBitmap) => {
        renderVideoToCanvas(canvasRef.current, imageBitmap);
      });
    }
  }, [renderVideoToCanvas, stream]);

  // useEffect(() => {
  //   if (!isVideoReady.current && hasStartedRenderLoop.current) {
  //     return;
  //   }

  //   hasStartedRenderLoop.current = true;

  //   function render() {
  //     if (
  //       canvasRef.current != null &&
  //       videoRef.current != null &&
  //       isVideoReady.current
  //     ) {
  //       console.log("track", track);
  //     }
  //     requestAnimationFrameRef.current = window.requestAnimationFrame(render);
  //   }

  //   requestAnimationFrameRef.current = window.requestAnimationFrame(render);

  //   return () => window.cancelAnimationFrame(requestAnimationFrameRef.current);
  // }, [renderVideoToCanvas, stream]);

  // useRenderVideoToCanvas(videoRef, canvasRef);

  return (
    <div className={classes.root}>
      <canvas ref={canvasRef} id="canvas"></canvas>
      <video ref={videoRef} src={stream} id="video"></video>
    </div>
  );
}
