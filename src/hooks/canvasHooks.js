import { useRef, useContext, useEffect, useCallback } from "react";
import MediaStreamContext from "../data_providers/MediaStreamContext";
import renderVideoToCanvas from "../utils/RenderVideoToCanvasWebGL";

export function useRenderStreamToCanvas(canvas) {
  const { stream } = useContext(MediaStreamContext);
  const requestAnimationFrameRef = useRef(null);
  const videoRef = useRef(null);
  const renderer = useRef(null);

  const onVideoPlay = useCallback(() => {
    if (canvas != null && videoRef.current.videoWidth > 0) {
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      renderer.current = renderVideoToCanvas(canvas, videoRef.current);
    }
  }, [canvas]);

  useEffect(() => {
    if (videoRef.current == null) {
      videoRef.current = document.createElement("video");
    }

    videoRef.current.addEventListener("playing", onVideoPlay);
    videoRef.current.srcObject = stream;
    videoRef.current.play();
  }, [canvas, onVideoPlay, stream]);

  useEffect(() => {
    function loop() {
      renderer.current?.render();
      requestAnimationFrameRef.current = window.requestAnimationFrame(loop);
    }

    requestAnimationFrameRef.current = window.requestAnimationFrame(loop);

    return () => window.cancelAnimationFrame(requestAnimationFrameRef.current);
  }, []);
}
