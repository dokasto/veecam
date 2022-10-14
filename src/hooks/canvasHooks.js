import { useRef, useContext, useEffect } from "react";
// import OffscreenCanvasWorker from "web-worker:../workers/OffscreenCanvasWorker";
import MediaStreamContext from "../data_providers/MediaStreamContext";

export function useRenderStreamToCanvas(canvas) {
  const { stream } = useContext(MediaStreamContext);
  const canvasContextRef = useRef(null);
  const requestAnimationFrameRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    if (canvas == null || stream == null) {
      return;
    }

    if (videoRef.current == null) {
      videoRef.current = document.createElement("video");
    }

    videoRef.current.srcObject = stream;
    videoRef.current.play();

    if (canvasContextRef.current == null) {
      canvasContextRef.current = canvas.getContext("2d");
    }

    function render() {
      if (videoRef.current.videoWidth > 0) {
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        canvasContextRef.current.drawImage(videoRef.current, 0, 0);
      }

      requestAnimationFrameRef.current = window.requestAnimationFrame(render);
    }

    requestAnimationFrameRef.current = window.requestAnimationFrame(render);

    return () => window.cancelAnimationFrame(requestAnimationFrameRef.current);
  }, [canvas, stream]);
}
