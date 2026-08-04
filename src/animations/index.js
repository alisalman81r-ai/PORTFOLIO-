/**
 * Barrel export for the animation vocabulary.
 *
 * This directory is framework-agnostic *values and factories* — variants,
 * easing curves, durations, GSAP setup, scroll helpers. The React components
 * that apply them live in `@/components/animations`.
 *
 * Keeping them apart means the timing vocabulary can be used from anywhere
 * (a canvas loop, a plain DOM handler) without importing React.
 *
 *   import { gsap, useGSAP, fadeInUp, TRANSITION } from '@/animations'
 */

/* GSAP core — always import from here, never from 'gsap' directly. This module
   owns plugin registration and house defaults, which must run exactly once. */
export { gsap, ScrollTrigger, useGSAP, refreshScrollTriggers } from './gsap'

/* Scroll-driven effect factories */
export {
  createParallax,
  createPinnedSection,
  createScrollProgress,
  createHorizontalScroll,
} from './scroll'

/* Timing vocabulary — mirrors the --ease-* / --duration-* tokens in theme.css */
export { EASE, DURATION, STAGGER, TRANSITION, SPRING, VIEWPORT } from './transitions'

/* Motion variants */
export {
  fadeIn,
  fadeInUp,
  fadeInDown,
  slideIn,
  scaleIn,
  maskReveal,
  staggerContainer,
  textLineReveal,
  pageTransition,
  pageVariants,
} from './variants'
