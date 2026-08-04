import { DURATION, EASE, STAGGER, TRANSITION } from './transitions'

/**
 * Reusable Motion variants.
 *
 * Variants are declared here rather than inline so that timing stays consistent
 * across sections and so a component's JSX stays about structure, not numbers.
 *
 * Usage:
 *
 *   import { motion } from 'motion/react'
 *   import { fadeInUp, staggerContainer, VIEWPORT } from '@/animations'
 *
 *   <motion.ul variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
 *     <motion.li variants={fadeInUp} />
 *   </motion.ul>
 *
 * A parent with `staggerContainer` propagates `hidden`/`visible` to children
 * automatically — children need `variants` but not their own `initial`.
 */

/** Opacity only. The safe default when transform would fight a layout. */
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: TRANSITION.base },
}

/** The standard entrance: rise and fade. */
export const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: TRANSITION.slow },
}

export const fadeInDown = {
  hidden: { opacity: 0, y: -24 },
  visible: { opacity: 1, y: 0, transition: TRANSITION.slow },
}

/**
 * Directional entrance factory — for grids and alternating layouts.
 *
 * @param {'left'|'right'|'up'|'down'} [direction='up']
 * @param {number} [distance=32] Travel distance in pixels.
 * @returns {object} A Motion variant.
 */
export const slideIn = (direction = 'up', distance = 32) => {
  const axis = direction === 'left' || direction === 'right' ? 'x' : 'y'
  const sign = direction === 'right' || direction === 'down' ? 1 : -1

  return {
    hidden: { opacity: 0, [axis]: distance * -sign },
    visible: { opacity: 1, [axis]: 0, transition: TRANSITION.slow },
  }
}

/** Subtle scale-up. Pair with `origin` classes for images and cards. */
export const scaleIn = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: TRANSITION.slow },
}

/**
 * Clip-path reveal — the editorial "wipe" used for images and headline blocks.
 * Cheaper than animating height and does not trigger layout.
 */
export const maskReveal = {
  hidden: { clipPath: 'inset(0 0 100% 0)' },
  visible: {
    clipPath: 'inset(0 0 0% 0)',
    transition: { duration: DURATION.slower, ease: EASE.outExpo },
  },
}

/**
 * Parent orchestrator. Holds no visual state of its own — it only schedules
 * its children.
 *
 * @param {number} [stagger=STAGGER.base] Seconds between children.
 * @param {number} [delayChildren=0] Seconds before the first child.
 * @returns {object}
 */
export const staggerContainer = (stagger = STAGGER.base, delayChildren = 0) => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren },
  },
})

/**
 * Per-line/word/character reveal, for split text.
 * Apply `overflow-hidden` to the wrapper so the glyphs clip on the way up.
 */
export const textLineReveal = {
  hidden: { y: '110%' },
  visible: { y: '0%', transition: { duration: DURATION.slow, ease: EASE.outExpo } },
}

/** Route-level crossfade, driven by <AnimatePresence mode="wait">. */
export const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: TRANSITION.base },
  exit: { opacity: 0, transition: TRANSITION.fast },
}
