/**
 * Math helpers for animation and scroll work.
 *
 * These get called inside rAF loops and scroll handlers, so they are kept
 * allocation-free and branch-light.
 */

/**
 * Constrain a value to an inclusive range.
 *
 * @param {number} value
 * @param {number} [min=0]
 * @param {number} [max=1]
 * @returns {number}
 */
export function clamp(value, min = 0, max = 1) {
  return Math.min(Math.max(value, min), max)
}

/**
 * Linear interpolation between two values.
 *
 * @param {number} start
 * @param {number} end
 * @param {number} t Progress, normally 0–1.
 * @returns {number}
 */
export function lerp(start, end, t) {
  return start + (end - start) * t
}

/**
 * Frame-rate independent smoothing — the correct replacement for the common
 * `current += (target - current) * 0.1` pattern, which runs at different speeds
 * on 60Hz and 144Hz displays.
 *
 * @param {number} current
 * @param {number} target
 * @param {number} smoothing Higher is snappier. ~8–16 feels natural.
 * @param {number} delta Seconds since the previous frame.
 * @returns {number}
 */
export function damp(current, target, smoothing, delta) {
  return lerp(current, target, 1 - Math.exp(-smoothing * delta))
}

/**
 * Normalise a value within a range to 0–1.
 *
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number} 0 when `min === max`, to avoid dividing by zero.
 */
export function progress(value, min, max) {
  if (min === max) return 0
  return (value - min) / (max - min)
}

/**
 * Remap a value from one range to another.
 *
 * @param {number} value
 * @param {number} inMin
 * @param {number} inMax
 * @param {number} outMin
 * @param {number} outMax
 * @param {boolean} [shouldClamp=false] Clamp the result to the output range.
 * @returns {number}
 */
export function mapRange(value, inMin, inMax, outMin, outMax, shouldClamp = false) {
  const t = progress(value, inMin, inMax)
  const mapped = lerp(outMin, outMax, t)
  return shouldClamp ? clamp(mapped, Math.min(outMin, outMax), Math.max(outMin, outMax)) : mapped
}

/**
 * Round to a fixed number of decimals. Useful for trimming transform strings
 * so the browser is not handed 15 significant digits every frame.
 *
 * @param {number} value
 * @param {number} [decimals=2]
 * @returns {number}
 */
export function roundTo(value, decimals = 2) {
  const factor = 10 ** decimals
  return Math.round(value * factor) / factor
}
