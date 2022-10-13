/**
 * Offscreen canvas web worker
 */

let canvas;
let context;
let width = 640;
let height = 480;

self.onmessage = (message) => {
  const { event, payload } = message.data;

  switch (event) {
    case "INIT":
      canvas = payload.canvas;
      context = canvas.getContext("2d");
      //   width = payload.width;
      //   height = payload.height;
      break;
    case "VIDEO_FRAME":
      if (canvas != null && context != null) {
        console.log("imageBitmap", payload.imageBitmap);
        context.drawImage(payload.imageBitmap, 0, 0, width, height);
      }
      break;
  }
};
