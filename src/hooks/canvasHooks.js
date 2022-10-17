import { useRef, useContext, useEffect, useCallback } from "react";
import ColorCorrectionContext from "../data_providers/ColorCorrectionContext";
import MediaStreamContext from "../data_providers/MediaStreamContext";
import renderVideoToCanvas from "../utils/RenderVideoToCanvasWebGL";

/* Tensor flow */
import "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";
import * as bodySegmentation from "@tensorflow-models/body-segmentation";
// import "@mediapipe/selfie_segmentation/selfie_segmentation";
import "@tensorflow/tfjs-converter";

export function useRenderStreamToCanvas(canvas) {
  const { stream } = useContext(MediaStreamContext);
  const { hue, saturation, brightness, contrast, exposure } = useContext(
    ColorCorrectionContext
  );
  const requestAnimationFrameRef = useRef(null);
  const glRef = useRef(null);
  const videoRef = useRef(null);
  const renderer = useRef(null);
  const segmenterRef = useRef(null);

  useEffect(() => {
    if (segmenterRef.current != null) {
      return;
    }
    const model = bodySegmentation.SupportedModels.MediaPipeSelfieSegmentation;
    const segmenterConfig = {
      runtime: "tfjs", // mediapipe/tfjs
      modelType: "general",
    };

    bodySegmentation
      .createSegmenter(model, segmenterConfig)
      .then((segmenter) => {
        segmenterRef.current = segmenter;
        console.log("segmenter ", segmenter);
      });
  }, []);

  const onVideoPlay = useCallback(() => {
    if (canvas != null && videoRef.current.videoWidth > 0) {
      glRef.current = canvas.getContext("webgl");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      videoRef.current.width = videoRef.current.videoWidth;
      videoRef.current.height = videoRef.current.videoHeight;
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
    async function loop() {
      if (
        segmenterRef.current != null &&
        videoRef.current != null &&
        renderer.current != null &&
        videoRef.current.videoWidth > 0 &&
        videoRef.current.videoHeight > 0
      ) {
        if (segmenterRef.current != null) {
          const segmentation = await segmenterRef.current.segmentPeople(
            videoRef.current
          );
          const [people] = segmentation;
          const segmentedImageData = await people.mask.toImageData();
          renderer.current?.render(segmentedImageData, {
            hue,
            saturation,
            brightness,
            contrast,
            exposure,
          });
        }
        // else {
        //   renderer.current?.render(videoRef.current, {
        //     hue,
        //     saturation,
        //     brightness,
        //     contrast,
        //     exposure,
        //   });
        // }
      }

      requestAnimationFrameRef.current = window.requestAnimationFrame(loop);
    }

    requestAnimationFrameRef.current = window.requestAnimationFrame(loop);

    return () => window.cancelAnimationFrame(requestAnimationFrameRef.current);
  }, [brightness, contrast, exposure, hue, saturation]);
}
