precision mediump float;

// our texture
uniform sampler2D u_video_frame;
// the texCoords passed in from the vertex shader.
varying vec2 v_texCoord;

uniform float u_exposure;
uniform float u_contrast;
uniform float u_saturation;
uniform float u_brightness;

const vec3 W = vec3(0.2125, 0.7154, 0.0721);

vec3 adjustExposure(vec3 color, float value) { return (1.0 + value) * color; }

vec3 adjustContrast(vec3 color, float value) {
  return 0.5 + (1.0 + value) * (color - 0.5);
}

// https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
vec3 adjustSaturation(vec3 color, float value) {
  const vec3 luminosityFactor = vec3(0.2126, 0.7152, 0.0722);
  vec3 grayscale = vec3(dot(color, luminosityFactor));
  return mix(grayscale, color, 1.0 + value);
}

vec3 adjustBrightness(vec3 color, float value) { return color + value; }

void main() {
  vec4 pixel = texture2D(u_video_frame, v_texCoord);
  vec3 color = pixel.rgb;

  color = clamp(adjustExposure(color, u_exposure), 0.0, 1.0);
  color = clamp(adjustContrast(color, u_contrast), 0.0, 1.0);
  color = clamp(adjustSaturation(color, u_saturation), 0.0, 1.0);
  color = clamp(adjustBrightness(color, u_brightness), 0.0, 1.0);

  gl_FragColor = vec4(color, 1.0);
}