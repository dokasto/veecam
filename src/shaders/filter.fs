precision mediump float;

// our texture
uniform sampler2D u_video_frame;
// the texCoords passed in from the vertex shader.
varying vec2 v_texCoord;

uniform float u_hue;
uniform float u_saturation;
uniform float u_brightness;
uniform float u_contrast;
uniform float u_exposure;

vec3 rgb2hsv(vec3 c) {
  vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
  vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
  vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
  float d = q.x - min(q.w, q.y);
  float e = 1.0e-10;
  return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
  vec4 pixel = texture2D(u_video_frame, v_texCoord);
  vec3 hsv = rgb2hsv(pixel.rgb);

  float h = hsv.x + u_hue;
  float s = hsv.y + u_saturation;
  float v = hsv.z + u_brightness;

  vec3 proccessed_pixel = hsv2rgb(vec3(h, s, v));

  gl_FragColor = vec4(proccessed_pixel, 1.0);
}