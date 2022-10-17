import filterFragmentShader from "../shaders/filter.fs";
import defaultVertexShader from "../shaders/default.vs";
import { useCallback, useRef } from "react";

export default function useRenderer() {
  const gl = useRef(null);
  const video = useRef(null);
  const positionLocation = useRef(null);
  const texcoordLocation = useRef(null);
  const videoTexture = useRef(null);
  const segmentedVideoTexture = useRef(null);
  const programRef = useRef(null);
  const texcoordBuffer = useRef(null);

  const init = useCallback((webGLContext, videoElementRef) => {
    gl.current = webGLContext;
    video.current = videoElementRef;

    const vertexShader = createShader(
      gl.current,
      gl.current.VERTEX_SHADER,
      defaultVertexShader
    );
    const fragmentShader = createShader(
      gl.current,
      gl.current.FRAGMENT_SHADER,
      filterFragmentShader
    );

    programRef.current = createProgram(
      gl.current,
      vertexShader,
      fragmentShader
    );

    // look up where the vertex data needs to go.
    positionLocation.current = gl.current.getAttribLocation(
      programRef.current,
      "a_position"
    );
    texcoordLocation.current = gl.current.getAttribLocation(
      programRef.current,
      "a_texCoord"
    );

    // Create a buffer to put three 2d clip space points in
    const positionBuffer = gl.current.createBuffer();

    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.current.bindBuffer(gl.current.ARRAY_BUFFER, positionBuffer);

    // Set a rectangle the same size as the image.
    setRectangle(
      gl.current,
      0,
      0,
      video.current.videoWidth,
      video.current.videoHeight
    );

    // provide texture coordinates for the rectangle.
    texcoordBuffer.current = gl.current.createBuffer();

    gl.current.bindBuffer(gl.current.ARRAY_BUFFER, texcoordBuffer.current);
    gl.current.bufferData(
      gl.current.ARRAY_BUFFER,
      new Float32Array([
        0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0,
      ]),
      gl.current.STATIC_DRAW
    );

    // Create a texture.
    videoTexture.current = initTexture(gl.current, gl.current.TEXTURE7);
    segmentedVideoTexture.current = initTexture(
      gl.current,
      gl.current.TEXTURE4
    );
  }, []);

  const render = useCallback(
    (videoFrame, segementedImageData, colorCorrectionParams) => {
      updateTexture(gl.current, videoTexture.current, videoFrame);
      updateTexture(
        gl.current,
        segmentedVideoTexture.current,
        segementedImageData
      );

      const resolutionLocation = gl.current.getUniformLocation(
        programRef.current,
        "u_resolution"
      );
      const videoFrameLocation = gl.current.getUniformLocation(
        programRef.current,
        "u_video_frame"
      );
      const segmentedVideoFrameLocation = gl.current.getUniformLocation(
        programRef.current,
        "u_segmented_video_frame"
      );

      // set the color correction uniform params
      const uniformParams = [];
      for (const param in colorCorrectionParams) {
        uniformParams.push([
          gl.current.getUniformLocation(programRef.current, "u_" + param),
          parseFloat(colorCorrectionParams[param]).toFixed(1),
        ]);
      }

      // Tell WebGL how to convert from clip space to pixels
      gl.current.viewport(
        0,
        0,
        gl.current.canvas.width,
        gl.current.canvas.height
      );

      // Clear the canvas
      gl.current.clearColor(0, 0, 0, 0);
      gl.current.clear(
        gl.current.COLOR_BUFFER_BIT | gl.current.DEPTH_BUFFER_BIT
      );

      // Tell it to use our program (pair of shaders)
      gl.current.useProgram(programRef.current);

      // Turn on the position attribute
      gl.current.enableVertexAttribArray(positionLocation.current);

      // Bind the position buffer.
      gl.current.bindBuffer(gl.current.ARRAY_BUFFER, texcoordBuffer.current);

      // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
      const size = 2; // 2 components per iteration
      const type = gl.current.FLOAT; // the data is 32bit floats
      const normalize = false; // don't normalize the data
      const stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
      const offset = 0; // start at the beginning of the buffer
      gl.current.vertexAttribPointer(
        positionLocation.current,
        size,
        type,
        normalize,
        stride,
        offset
      );

      // Turn on the texcoord attribute
      gl.current.enableVertexAttribArray(texcoordLocation.current);

      // bind the texcoord buffer.
      gl.current.bindBuffer(gl.current.ARRAY_BUFFER, texcoordBuffer.current);

      gl.current.vertexAttribPointer(
        texcoordLocation.current,
        size,
        type,
        normalize,
        stride,
        offset
      );

      // set the resolution
      gl.current.uniform2f(
        resolutionLocation.current,
        gl.current.canvas.width,
        gl.current.canvas.height
      );
      gl.current.uniform1i(videoFrameLocation, 7);
      gl.current.uniform1i(segmentedVideoFrameLocation, 4);

      // set the params
      for (const param of uniformParams) {
        gl.current.uniform1f(...param);
      }

      // Draw the rectangle.
      gl.current.drawArrays(gl.current.TRIANGLES, offset, 6);
    },
    []
  );

  const destroy = useCallback(() => {
    gl.current = null;
    video.current = null;
    positionLocation.current = null;
    texcoordLocation.current = null;
    videoTexture.current = null;
    segmentedVideoTexture.current = null;
    programRef.current = null;
    texcoordBuffer.current = null;
  }, []);

  return { init, render, destroy };
}

function setRectangle(gl, x, y, width, height) {
  const x1 = x;
  const x2 = x + width;
  const y1 = y;
  const y2 = y + height;
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]),
    gl.STATIC_DRAW
  );
}

function updateTexture(gl, texture, videoFrame) {
  const level = 0;
  const internalFormat = gl.RGBA;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;

  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(
    gl.TEXTURE_2D,
    level,
    internalFormat,
    srcFormat,
    srcType,
    videoFrame
  );
}

function initTexture(gl, textureIndex) {
  const texture = gl.createTexture();
  gl.activeTexture(textureIndex);
  gl.bindTexture(gl.TEXTURE_2D, texture);

  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([0, 0, 255, 255]); // opaque blue
  gl.texImage2D(
    gl.TEXTURE_2D,
    level,
    internalFormat,
    width,
    height,
    border,
    srcFormat,
    srcType,
    pixel
  );

  // Turn off mips and set wrapping to clamp to edge so it
  // will work regardless of the dimensions of the video.
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  return texture;
}

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}
