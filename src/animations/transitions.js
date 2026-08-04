/**
 * Motion primitives — the single source of truth for timing.
 *
 * These mirror the `--ease-*` and `--duration-*` tokens in `styles/theme.css`.
 * Keeping one vocabulary across CSS, Motion, and GSAP is what stops a site from
 * feeling like three different sites glued together. Change a curve here and in
 * theme.css together.
 */

/**
 * Cubic-bezier control points, in Motion's `[x1, y1, x2, y2]` array form.
 * @type {Record<string, number[]>}
 */
export const EASE = {
  /** Fast start, long glide. The workhorse for entrances. */
  outExpo: [0.16, 1, 0.3, 1],
  /** Symmetrical and dramatic. For full-screen and page transitions. */
  inOutExpo: [0.87, 0, 0.13, 1],
  /** Softer than outExpo. For small UI moves and hovers. */
  outQuart: [0.25, 1, 0.5, 1],
  /** Slight overshoot. Use sparingly — it reads as playful. */
  spring: [0.34, 1.56, 0.64, 1],
}

/**
 * Durations in seconds (Motion's unit — GSAP uses seconds too).
 * @type {Record<string, number>}
 */
export const DURATION = {
  fast: 0.2,
  base: 0.4,
  slow: 0.8,
  slower: 1.2,
}

/** Delay between children in a staggered group, in seconds. */
export const STAGGER = {
  tight: 0.04,
  base: 0.08,
  loose: 0.14,
}

/**
 * Ready-made transition objects to spread into a Motion component.
 *
 *   <motion.div transition={TRANSITION.base} />
 */
export const TRANSITION = {
  fast: { duration: DURATION.fast, ease: EASE.outQuart },
  base: { duration: DURATION.base, ease: EASE.outExpo },
  slow: { duration: DURATION.slow, ease: EASE.outExpo },
  reveal: { duration: DURATION.slower, ease: EASE.outExpo },
}

/**
 * Physics-based transitions. Preferred over duration curves for anything the
 * user interacts with directly (drag, cursor follow, toggles) because they stay
 * continuous when interrupted mid-flight.
 */
export const SPRING = {
  soft: { type: 'spring', stiffness: 120, damping: 20, mass: 1 },
  snappy: { type: 'spring', stiffness: 400, damping: 32, mass: 0.8 },
  bouncy: { type: 'spring', stiffness: 300, damping: 14, mass: 0.9 },
}

/**
 * Default `viewport` prop for scroll-triggered Motion components.
 * `once: true` matters — re-animating on every scroll-by is a common tell of an
 * amateur build, and it costs performance.
 */
export const VIEWPORT = {
  once: true,
  amount: 0.25,
  margin: '0px 0px -10% 0px',
}
