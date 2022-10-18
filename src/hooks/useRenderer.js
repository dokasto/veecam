import filterFragmentShader from "../shaders/filter.fs";
import defaultVertexShader from "../shaders/default.vs";
import { useRef, useCallback } from "react";

export default function useRenderer() {
  const glRef = useRef(null);
  const programRef = useRef(null);

  const init = useCallback((gl) => {
    glRef.current = gl;

    const vertexShader = createShader(
      gl,
      gl.VERTEX_SHADER,
      defaultVertexShader
    );
    const fragmentShader = createShader(
      gl,
      gl.FRAGMENT_SHADER,
      filterFragmentShader
    );

    programRef.current = createProgram(gl, vertexShader, fragmentShader);
  }, []);

  const render = useCallback((video, segmentedVideo, colorCorrectionParams) => {
    const gl = glRef.current;
    const program = programRef.current;

    if (gl == null) {
      console.error("GL not initialised");
      return;
    }

    // look up where the vertex data needs to go.
    const positionLocation = gl.getAttribLocation(program, "a_position");
    const texcoordLocation = gl.getAttribLocation(program, "a_texCoord");

    // Create a buffer to put three 2d clip space points in
    const positionBuffer = gl.createBuffer();

    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Set a rectangle the same size as the image.
    setRectangle(gl, 0, 0, video.videoWidth, video.videoHeight);

    // provide texture coordinates for the rectangle.
    const texcoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0,
      ]),
      gl.STATIC_DRAW
    );

    // Create a texture.
    const videoTexture = initTexture(gl, gl.TEXTURE7);
    const segmentedVideoTexture = initTexture(gl, gl.TEXTURE4);

    updateTexture(gl, videoTexture, video);
    updateTexture(gl, segmentedVideoTexture, segmentedVideo);

    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const videoFrameLocation = gl.getUniformLocation(program, "u_video_frame");
    const segmentedVideoFrameLocation = gl.getUniformLocation(
      program,
      "u_segmented_video_frame"
    );

    // set the color correction uniform params
    const uniformParams = [];
    for (const param in colorCorrectionParams) {
      uniformParams.push([
        gl.getUniformLocation(program, "u_" + param),
        parseFloat(colorCorrectionParams[param]).toFixed(1),
      ]);
    }

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);

    // Turn on the position attribute
    gl.enableVertexAttribArray(positionLocation);

    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    const size = 2; // 2 components per iteration
    const type = gl.FLOAT; // the data is 32bit floats
    const normalize = false; // don't normalize the data
    const stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
    const offset = 0; // start at the beginning of the buffer
    gl.vertexAttribPointer(
      positionLocation,
      size,
      type,
      normalize,
      stride,
      offset
    );

    // Turn on the texcoord attribute
    gl.enableVertexAttribArray(texcoordLocation);

    // bind the texcoord buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);

    gl.vertexAttribPointer(
      texcoordLocation,
      size,
      type,
      normalize,
      stride,
      offset
    );

    // set the resolution
    gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
    gl.uniform1i(videoFrameLocation, 7);
    gl.uniform1i(segmentedVideoFrameLocation, 4);

    // set the params
    for (const param of uniformParams) {
      gl.uniform1f(...param);
    }

    // Draw the rectangle.
    gl.drawArrays(gl.TRIANGLES, offset, 6);
  }, []);

  const destroy = useCallback(() => {
    glRef.current = null;
    programRef.current = null;
  }, []);

  return { render, init, destroy };
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

  // Because video has to be download over the internet
  // they might take a moment until it's ready so
  // put a single pixel in the texture so we can
  // use it immediately.
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
