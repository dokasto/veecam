import { useRef, useContext, useEffect, useCallback } from "react";
import ColorCorrectionContext from "../data_providers/ColorCorrectionContext";
import MediaStreamContext from "../data_providers/MediaStreamContext";
import useRenderer from "../hooks/useRenderer";

/* Tensor flow */
import "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";
import * as bodySegmentation from "@tensorflow-models/body-segmentation";
// import "@mediapipe/selfie_segmentation/selfie_segmentation";
import "@tensorflow/tfjs-converter";

export default function useRenderStreamToCanvas(canvas) {
  const { stream } = useContext(MediaStreamContext);
  const videoRef = useRef(null);
  const webGLContextRef = useRef(null);
  const hasInitializedRenderer = useRef(false);
  const renderer = useRenderer();
  const requestAnimationFrameRef = useRef(null);
  const { hue, saturation, brightness, contrast, exposure } = useContext(
    ColorCorrectionContext
  );

  /**
   * - create video element
   * - bind stream to video element
   * - create segementer
   * - start rendering
   */

  // create video element once
  const onVideoPlay = useCallback(() => {
    videoRef.current.width = videoRef.current.videoWidth;
    videoRef.current.height = videoRef.current.videoHeight;
  }, []);

  useEffect(() => {
    if (videoRef.current != null) {
      return;
    }

    videoRef.current = document.createElement("video");

    videoRef.current.addEventListener("playing", onVideoPlay);
    videoRef.current.srcObject = stream;
    videoRef.current.play();

    () => {
      videoRef.current.removeEventListener("playing", onVideoPlay);
      videoRef.current.srcObject = null;
      videoRef.current.stop();
    };
  }, [onVideoPlay, stream]);

  // update video source when the stream changes
  useEffect(() => {
    if (videoRef.current != null && stream != null) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  // set WebGL ref only once
  useEffect(() => {
    if (!(webGLContextRef.current == null && canvas != null)) {
      return;
    }
    webGLContextRef.current = canvas.getContext("webgl");

    return () => {
      webGLContextRef.current = null;
    };
  }, [canvas]);

  // Intialize renderer once
  useEffect(() => {
    if (
      !hasInitializedRenderer.current &&
      webGLContextRef.current != null &&
      videoRef.current != null
    ) {
      renderer.init(webGLContextRef.current, videoRef.current);
      hasInitializedRenderer.current = true;
    }

    () => {
      if (hasInitializedRenderer.current) {
        // renderer.destroy();
      }
    };
  }, [renderer]);

  // run render loop
  useEffect(() => {
    if (requestAnimationFrameRef.current != null) {
      return;
    }

    function loop() {
      if (hasInitializedRenderer.current && videoRef.current.videoWidth > 0) {
        renderer.render(videoRef.current, videoRef.current, {
          hue,
          saturation,
          brightness,
          contrast,
          exposure,
        });
      }

      requestAnimationFrameRef.current = window.requestAnimationFrame(loop);
    }

    requestAnimationFrameRef.current = window.requestAnimationFrame(loop);

    return () => {
      window.cancelAnimationFrame(requestAnimationFrameRef.current);
      requestAnimationFrameRef.current = null;
    };
  }, [brightness, contrast, exposure, hue, renderer, saturation]);

  ////////////////////////////////////////////////////

  // const { hue, saturation, brightness, contrast, exposure } = useContext(
  //   ColorCorrectionContext
  // );
  // const requestAnimationFrameRef = useRef(null);
  // const glRef = useRef(null);

  // const renderer = useRef(null);
  // const segmenterRef = useRef(null);

  // const onVideoPlay = useCallback(() => {
  //   if (canvas != null && videoRef.current.videoWidth > 0) {
  //     glRef.current = canvas.getContext("webgl");
  //     canvas.width = videoRef.current.videoWidth;
  //     canvas.height = videoRef.current.videoHeight;
  //     videoRef.current.width = videoRef.current.videoWidth;
  //     videoRef.current.height = videoRef.current.videoHeight;
  //     renderer.current = renderVideoToCanvas(glRef.current, videoRef.current);
  //   }
  // }, [canvas]);

  // useEffect(() => {
  //   if (segmenterRef.current != null) {
  //     return;
  //   }
  //   const model = bodySegmentation.SupportedModels.MediaPipeSelfieSegmentation;
  //   const segmenterConfig = {
  //     runtime: "tfjs", // mediapipe/tfjs
  //     modelType: "general",
  //   };

  //   bodySegmentation
  //     .createSegmenter(model, segmenterConfig)
  //     .then((segmenter) => {
  //       segmenterRef.current = segmenter;
  //     });
  // }, []);

  // useEffect(() => {
  //   if (videoRef.current == null) {
  //     videoRef.current = document.createElement("video");
  //   }
  //   videoRef.current.addEventListener("playing", onVideoPlay);
  //   videoRef.current.srcObject = stream;
  //   videoRef.current.play();
  // }, [canvas, onVideoPlay, stream]);

  // useEffect(() => {
  //   async function loop() {
  //     if (
  //       segmenterRef.current != null &&
  //       videoRef.current != null &&
  //       renderer.current != null &&
  //       videoRef.current.videoWidth > 0 &&
  //       videoRef.current.videoHeight > 0
  //     ) {
  //       if (segmenterRef.current != null) {
  //         const segmentation = await segmenterRef.current.segmentPeople(
  //           videoRef.current
  //         );
  //         const [people] = segmentation;
  //         const segmentedImageData = await people.mask.toImageData();
  //         renderer.current?.render(videoRef.current, segmentedImageData, {
  //           hue,
  //           saturation,
  //           brightness,
  //           contrast,
  //           exposure,
  //         });
  //       }
  //     }

  //     requestAnimationFrameRef.current = window.requestAnimationFrame(loop);
  //   }

  //   requestAnimationFrameRef.current = window.requestAnimationFrame(loop);

  //   return () => window.cancelAnimationFrame(requestAnimationFrameRef.current);
  // }, [brightness, contrast, exposure, hue, saturation]);
}
