/**
 * @license Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)
 *
 * This sketch is licensed under CC BY-NC-SA 4.0. You are free to:
 * - Share and adapt this work
 * - Use modified versions commercially
 *
 * Under these conditions:
 * - Attribution: Credit Ben McCormick (phobon) and link to this project
 * - NonCommercial: Don't sell the original, unmodified sketch
 * - ShareAlike: Distribute derivatives under the same license
 */
import {
  abs,
  float,
  fract,
  mix,
  sin,
  step,
  time,
  uv,
  vec3,
  Fn,
} from "three/tsl";

/**
 * Genuary 1: Vertical or horizontal lines only
 */
const genuary1 = Fn(() => {
  // Centered UVs and original UVs
  const _uv = uv().sub(0.5);
  const uv0 = uv();

  const freq = float(50);
  const _time = time.mul(0.5);

  const pattern = step(uv0.y, abs(fract(_uv.y.mul(freq))));

  // Mask for shape boundaries
  const mask = step(0.2, abs(_uv.x).add(abs(_uv.y).add(_uv.y.mul(sin(_time)))));

  // Palette
  const c1 = vec3(0.5, 0.61, 0.81);
  const c2 = vec3(0.92, 0.77, 0.84);

  // Gradient color, modulated by time
  const color = mix(c1, c2, uv0.y.mul(2).mul(sin(_time)));

  // Blend with white based on pattern
  const colorM1 = mix(color, vec3(1), pattern);

  // Final blend with white based on mask
  const finalColor = mix(colorM1, vec3(1), mask);

  return finalColor;
});

export default genuary1;
