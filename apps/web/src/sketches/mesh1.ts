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

import { Color } from 'three/webgpu'
import { screenAspectUV } from '@/tsl/utils/function/screen_aspect_uv'
import {
  rotate,
  uniformArray,
  float,
  uniform,
  vec2,
  int,
  length,
  Loop,
  Fn,
  screenSize,
  time,
  oneMinus,
  sin,
  cos,
  mul,
  PI,
  pow,
  div,
  max,
  log,
  vec3,
} from 'three/tsl'
import { grainTextureEffect } from '@/tsl/effects/grain_texture_effect'
import { turbulence } from '@/tsl/noise/turbulence'

const colors = uniformArray([new Color('#fff9bf'), new Color('#f8a097'), new Color('#b7dbf9'), new Color('#20b2aa')])
const colorsCount = int(4)

const weights = uniformArray([1.5, 1.5, 1, 1, 1, 1])

// We use 3 types of distortion in this mesh gradient shader:
// - Simple circular distortion with amplitude
// - Turbulence (layered sin, courtesy of @XorDev)
// - Vortex distortion, rotating from the center of the screen
const distortionFactor = uniform(0.8)
const vortexFactor = uniform(0.2)
const amp1 = uniform(2)
const amp2 = uniform(2.5)

export const mesh1 = Fn(() => {
  const _uv = screenAspectUV(screenSize).toVar()
  const uv0 = screenAspectUV(screenSize).toVar()

  _uv.mulAssign(3)

  const _time = time.mul(0.05)

  // Calculate distance from center and create a smooth falloff - this creates a circular mask that's strongest at the edges
  const radius = length(uv0)
  const center = oneMinus(radius) // Inverted - strongest at center

  // Apply coordinate distortion based on distance from center
  // The distortion creates a warping effect that's stronger near the center
  const _d = float(distortionFactor)
  Loop({ start: 1, end: 3, type: 'float', condition: '<=' }, ({ i }) => {
    const strength = _d.mul(center).div(i).div(i).negate()

    _uv.x.addAssign(strength.mul(sin(_time.sub(_uv.y.mul(i)))).mul(amp2))
    _uv.y.addAssign(strength.mul(cos(_time.sub(_uv.x.mul(i)))).mul(amp1))
  })

  // Add turbulence distortion
  _uv.assign(turbulence(_uv, time.mul(1.5), mul(2.5, _d), 0.7, 0.3, 1.5, 0.5))

  // Calculate rotation angle based on distance from center
  // Creates a vortex that's more dramatic at the edges
  const uvR = _uv
  const angle = log(length(uvR)).mul(vortexFactor)
  uvR.assign(rotate(uvR, angle))

  const finalColor = vec3(0).toVar()
  const totalWeight = float(0).toVar()

  // Loop through all color spots and blend them together
  Loop({ start: 0, end: colorsCount, type: 'float' }, ({ i }) => {
    // Base angle for this color spot - creates different starting positions
    const baseAngle = i.mul(PI)

    // Calculate starting positions based on index, angle and speed
    const x = sin(_time.mul(i.mul(0.75)).add(baseAngle))
    const y = cos(_time.mul(2).add(baseAngle.mul(2.5)))
    const pos = vec2(x, y)

    const _c = colors.element(i)

    // Calculate distance from current fragment to this color spot
    const dist = length(uvR.sub(pos))

    // Apply power function to create sharper falloff. This will create those sharper region edges that make mesh gradients so dramatic
    dist.assign(pow(dist, 2.5))

    // Calculate weight based on distance - closer spots have higher weight
    const weight = div(1, max(0, dist))

    // Accumulate color and total weight
    finalColor.addAssign(_c.mul(weight.mul(weights.element(i))))
    totalWeight.addAssign(weight)
  })

  // Normalize the color
  finalColor.divAssign(totalWeight)

  // Tonemap for more interesting output
  // finalColor.assign(tanh(finalColor.mul(2)))
  finalColor.mulAssign(finalColor)

  // Add grain
  const _grain = grainTextureEffect(uv0).mul(0.1)
  finalColor.addAssign(_grain)

  return finalColor
});

export default mesh1