import { useRef, useContext, useEffect, useCallback } from "react";
import ColorCorrectionContext from "../data_providers/ColorCorrectionContext";
import MediaStreamContext from "../data_providers/MediaStreamContext";
import renderVideoToCanvas from "../utils/RenderVideoToCanvasWebGL";

export function useRenderStreamToCanvas(canvas) {
  const { stream } = useContext(MediaStreamContext);
  const { hue, saturation, brightness, contrast, exposure } = useContext(
    ColorCorrectionContext
  );
  const requestAnimationFrameRef = useRef(null);
  const glRef = useRef(null);
  const videoRef = useRef(null);
  const renderer = useRef(null);

  const onVideoPlay = useCallback(() => {
    if (canvas != null && videoRef.current.videoWidth > 0) {
      glRef.current = canvas.getContext("webgl");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      renderer.current = renderVideoToCanvas(glRef.current, videoRef.current);
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
      renderer.current?.render({
        hue,
        saturation,
        brightness,
        contrast,
        exposure,
      });
      requestAnimationFrameRef.current = window.requestAnimationFrame(loop);
    }

    requestAnimationFrameRef.current = window.requestAnimationFrame(loop);

    return () => window.cancelAnimationFrame(requestAnimationFrameRef.current);
  }, [brightness, contrast, exposure, hue, saturation]);
}
