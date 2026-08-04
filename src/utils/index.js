/**
 * Barrel export for utilities.
 *
 * Pure functions only — no React, no DOM side effects, no module state. Every
 * helper here should be callable from anywhere and testable without a renderer.
 * Anything that needs a component lifecycle belongs in `@/hooks`.
 *
 *   import { cn, clamp, formatDateRange } from '@/utils'
 */

/* Class-name composition with Tailwind conflict resolution */
export { cn } from './cn'

/* Math — animation and scroll interpolation */
export { clamp, lerp, damp, progress, mapRange, roundTo } from './math'

/* Display formatting for stored values */
export {
  formatMonthYear,
  formatDateRange,
  formatDuration,
  padIndex,
  formatUrlLabel,
} from './format'
