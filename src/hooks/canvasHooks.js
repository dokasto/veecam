import { useRef, useContext, useEffect } from "react";
// import OffscreenCanvasWorker from "web-worker:../workers/OffscreenCanvasWorker";
import MediaStreamContext from "../data_providers/MediaStreamContext";

export function useRenderStreamToCanvas(canvas) {
  const { stream } = useContext(MediaStreamContext);
  const imageCaptureRef = useRef(null);
  const videoTrackRef = useRef(null);
  const canvasContextRef = useRef(null);
  const requestAnimationFrameRef = useRef(null);

  useEffect(() => {
    if (canvas == null || stream == null) {
      return;
    }
    canvasContextRef.current = canvas.getContext("bitmaprenderer");
    videoTrackRef.current = stream.getVideoTracks()[0];
    imageCaptureRef.current = new ImageCapture(videoTrackRef.current);
  }, [canvas, stream]);

  useEffect(() => {
    if (requestAnimationFrameRef.current != null || canvas == null) {
      return;
    }

    function render() {
      imageCaptureRef.current
        ?.grabFrame()
        .then((imageBitmap) => {
          canvas.width = imageBitmap.width;
          canvas.height = imageBitmap.height;
          canvasContextRef.current?.transferFromImageBitmap(imageBitmap);
        })
        .catch(() => {
          /**
           * see https://stackoverflow.com/questions/56747195/is-there-a-way-to-send-video-data-from-a-video-tag-mediastream-to-an-offscreenca
           */
        });

      requestAnimationFrameRef.current = window.requestAnimationFrame(render);
    }

    requestAnimationFrameRef.current = window.requestAnimationFrame(render);

    return () => window.cancelAnimationFrame(requestAnimationFrameRef);
  }, [canvas]);
}
