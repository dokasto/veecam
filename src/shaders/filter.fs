precision mediump float;

uniform sampler2D u_video_frame;
uniform sampler2D u_segmented_video_frame;

// the texCoords passed in from the vertex shader.
varying vec2 v_texCoord;

uniform float u_blur;
uniform float u_exposure;
uniform float u_contrast;
uniform float u_saturation;
uniform float u_brightness;
uniform vec2 u_resolution;


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

vec4 apply_blur(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {
  vec4 color = vec4(0.0);
  vec2 off1 = vec2(1.3333333333333333) * direction;
  color += texture2D(image, uv) * 0.29411764705882354;
  color += texture2D(image, uv + (off1 / resolution)) * 0.35294117647058826;
  color += texture2D(image, uv - (off1 / resolution)) * 0.35294117647058826;
  return color; 
}


void main() {
  vec4 video_pixel = texture2D(u_video_frame, v_texCoord);
  vec4 segmented_video_pixel = texture2D(u_segmented_video_frame, v_texCoord);
  vec3 color = segmented_video_pixel.rgb;

 if (segmented_video_pixel.rgb.r != 0.0 && segmented_video_pixel.rgb.y == 0.0 && segmented_video_pixel.rgb.z == 0.0) {
    color = video_pixel.rgb;
    color = clamp(adjustExposure(color, u_exposure), 0.0, 1.0);
    color = clamp(adjustContrast(color, u_contrast), 0.0, 1.0);
    color = clamp(adjustSaturation(color, u_saturation), 0.0, 1.0);
    color = clamp(adjustBrightness(color, u_brightness), 0.0, 1.0);
    gl_FragColor = vec4(color, 1.0);
 } else {
    int _KernelSize = 10;
    int upper = ((_KernelSize - 1) / 2);
		int lower = -upper;
    vec2 uv = vec2(gl_FragCoord.xy / u_resolution.xy);

    for (int x = lower; x <= upper; ++x) {
      color += texture2D(u_video_frame, uv + fixed2(u_resolution.x * float(x), 0.0));
      // color += texture2D(image, uv + (off1 / resolution)) * 0.35294117647058826;
    }

    color /= _KernelSize;
    
    gl_FragColor = vec4(_KernelSize, 1.0);
 }

  
}