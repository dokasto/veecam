precision mediump float;

uniform sampler2D u_video_frame;

varying vec2 v_texCoord;

uniform float u_exposure;
uniform float u_contrast;
uniform float u_saturation;
uniform float u_brightness;

vec3 adjustExposure(vec3 color, float value) { return (1.0 + value) * color; }

vec3 adjustContrast(vec3 color, float value) {
  return 0.5 + (1.0 + value) * (color - 0.5);
}

vec3 adjustSaturation(vec3 color, float value) {
  const vec3 luminosityFactor = vec3(0.2126, 0.7152, 0.0722);
  vec3 grayscale = vec3(dot(color, luminosityFactor));
  return mix(grayscale, color, 1.0 + value);
}

vec3 adjustBrightness(vec3 color, float value) { return color + value; }

void main() {
  vec4 video_pixel = texture2D(u_video_frame, v_texCoord);
  vec3 color = video_pixel.rgb;

  color = clamp(adjustExposure(color, u_exposure), 0.0, 1.0);
  color = clamp(adjustContrast(color, u_contrast), 0.0, 1.0);
  color = clamp(adjustSaturation(color, u_saturation), 0.0, 1.0);
  color = clamp(adjustBrightness(color, u_brightness), 0.0, 1.0);

  gl_FragColor = vec4(color, 1.0);
}