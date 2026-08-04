/**
 * Barrel export for the animation layer.
 *
 *   import { gsap, useGSAP, fadeInUp, TRANSITION } from '@/animations'
 */

export { gsap, ScrollTrigger, useGSAP, refreshScrollTriggers } from './gsap'

export {
  EASE,
  DURATION,
  STAGGER,
  TRANSITION,
  SPRING,
  VIEWPORT,
} from './transitions'

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
} from './variants'
