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

import { float, Fn, smoothstep, time, vec3, screenSize, abs, pow, mix, Loop, PI, sin, uv, step, array } from 'three/tsl'
import { screenAspectUV } from '@/tsl/utils/function/screen_aspect_uv'
import { simplexNoise3d } from '@/tsl/noise/simplex_noise_3d'
import { cosinePalette } from '@/tsl/utils/color/cosine_palette'

/**
 * Genuary 30: Abstract map
 */
const genuary30 = Fn(() => {
  const _uv = screenAspectUV(screenSize).toVar()
  const uv0 = screenAspectUV(screenSize).toVar()
  const v_uv = uv()

  const finalColor = vec3(0.0).toVar()

  const a = vec3(0.5, 0.5, 0.5)
  const b = vec3(0.5, 0.2, 0.25)
  const c = vec3(0.5, 0.5, 0.5)
  const d = vec3(2.0, 1.0, 0.0)

  const noise = Fn(([o]) => {
    const n = float(0).toVar()

    // @ts-ignore
    n.subAssign(
      abs(
        simplexNoise3d(vec3(o.mul(5.0).mul(5), 0.0, time.mul(0.1)))
          .mul(1.1)
          .div(5),
      ),
    )

    return n
  })

  const iterations = 30

  const uv1 = uv0
  const n = array('float', iterations)

  // @ts-ignore
  Loop({ start: 0, end: iterations }, ({ i }) => {
    n.element(i).assign(0)
  })

  // @ts-ignore
  Loop({ start: 0, end: iterations }, ({ i }) => {
    n.element(i).assign(noise(uv1.x.add(float(i).mul(0.25))))
  })

  const p = pow(sin(v_uv.x.mul(PI)), 15.0)
  const p2 = pow(sin(v_uv.x.mul(PI)), 3.0)
  const scalar = mix(0.00075, 0.0025, p)

  const pattern = Fn(([_p, s]) => {
    const p = _p.toVar()
    p.assign(abs(p))
    p.assign(pow(s.div(p), 1.2))

    return p
  })

  // @ts-ignore
  Loop({ start: 0, end: iterations }, ({ i }) => {
    _uv.y.addAssign(0.01)

    const offset = p.mul(n.element(i)).mul(0.25)

    const s = _uv.y.add(offset.sub(0.25)).toVar()
    s.assign(pattern(s, scalar))

    const col = cosinePalette(p2.add(1.75), a, b, c, d)
    finalColor.addAssign(col.mul(s))
  })

  const black = vec3(0.0)
  const m = step(0.25, v_uv.x).toVar()
  m.subAssign(step(0.75, v_uv.x))

  const m2 = smoothstep(0.2, 0.35, v_uv.x).toVar()
  m2.subAssign(smoothstep(0.65, 0.8, v_uv.x))

  finalColor.assign(mix(black, finalColor, m))
  finalColor.assign(mix(black, finalColor, m2))

  return finalColor
})

export default genuary30