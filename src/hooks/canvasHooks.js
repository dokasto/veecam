import { useRef, useCallback } from "react";
import OffscreenCanvasWorker from "web-worker:../workers/OffscreenCanvasWorker";

export function useRenderVideoToCanvas() {
  const offscreenRef = useRef(null);
  const workerRef = useRef(new OffscreenCanvasWorker());
  const hasTransferedControlRef = useRef(false);

  return useCallback((canvas, imageBitmap) => {
    if (!hasTransferedControlRef.current) {
      hasTransferedControlRef.current = true;
      offscreenRef.current = canvas.transferControlToOffscreen();
      workerRef.current.postMessage(
        { event: "INIT", payload: { canvas: offscreenRef.current } },
        [offscreenRef.current]
      );
    } else {
      workerRef.current.postMessage({
        event: "VIDEO_FRAME",
        payload: { imageBitmap },
      });
    }

    // canvas.width = videoWidth;
    // canvas.height = videoHeight;
    // contextRef.current = canvas.getContext("2d");
    // contextRef.current.drawImage(video, 0, 0, videoWidth, videoHeight);
    // console.log("render shit");
  }, []);
}
