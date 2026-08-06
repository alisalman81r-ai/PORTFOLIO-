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
 *
 * CHOOSING AN ENTRANCE VECTOR
 * ---------------------------
 * Every variant here shares one easing vocabulary and one set of durations, so
 * the site reads as a single motion language. What varies is the *direction*,
 * and it is chosen by what the content is — not for variety's sake:
 *
 *   fadeInUp     Sequential, narrative content read top to bottom — timelines,
 *                paragraphs, list items. Rising matches reading direction.
 *   scaleIn      Discrete objects in a grid — skill cards, stat tiles. They
 *                settle forward into place rather than sliding from elsewhere.
 *   maskReveal   Editorial content led by imagery — article covers. A wipe is
 *                the print idiom, and it suits a picture better than a slide.
 *   slideIn      Laterally-composed rows — the alternating project showcase,
 *                where copy and media converge from opposite sides.
 *
 * Applying one variant everywhere is what makes a long page feel like the same
 * animation eleven times; applying them arbitrarily makes it feel unplanned.
 * Matching the vector to the content is what keeps it deliberate.
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

/**
 * Route-level crossfade, driven by <AnimatePresence mode="wait">.
 *
 * Kept as the default export name for backwards compatibility — it is the
 * `fade` entry of `pageVariants` below.
 */
export const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: TRANSITION.base },
  exit: { opacity: 0, transition: TRANSITION.fast },
}

/**
 * Page transition presets.
 *
 * One vocabulary for route changes, so a new page picks a *named feel* rather
 * than inventing its own numbers. Consumed by `<PageTransition>`.
 *
 * Every preset shares two rules:
 *
 *   1. EXIT IS FASTER THAN ENTRY. The user has already decided to leave; a
 *      slow exit reads as the interface not keeping up. With
 *      `AnimatePresence mode="wait"` the exit is dead time before the new page
 *      can even start, so it is the cheapest thing to shorten.
 *   2. TRANSFORM AND OPACITY ONLY. Both are compositor properties, so a full
 *      page can animate without a single layout or paint pass — which is what
 *      keeps a route change smooth on a phone.
 *
 * Distances are deliberately small. A page that slides half the viewport looks
 * impressive once and feels slow every time after that.
 */
export const pageVariants = {
  /** Neutral. The safe default — nothing moves, so nothing can feel wrong. */
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: TRANSITION.base },
    exit: { opacity: 0, transition: TRANSITION.fast },
  },

  /** Rises into place. Suits content pages that follow a link downward. */
  slideUp: {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0, transition: TRANSITION.slow },
    exit: { opacity: 0, y: -12, transition: TRANSITION.fast },
  },

  /** Enters from the right, leaves to the left — a lateral, sequential feel. */
  slide: {
    initial: { opacity: 0, x: 32 },
    animate: { opacity: 1, x: 0, transition: TRANSITION.slow },
    exit: { opacity: 0, x: -16, transition: TRANSITION.fast },
  },

  /**
   * Settles forward from slightly behind. The most "app-like" of the four.
   * Scale stays within 2% — beyond that, text visibly resamples mid-animation
   * and the whole page looks briefly blurred.
   */
  scale: {
    initial: { opacity: 0, scale: 0.985 },
    animate: { opacity: 1, scale: 1, transition: TRANSITION.slow },
    exit: { opacity: 0, scale: 1.008, transition: TRANSITION.fast },
  },
}
