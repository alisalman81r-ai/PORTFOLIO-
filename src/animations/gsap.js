import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

import { DURATION } from './transitions'

/**
 * Central GSAP configuration.
 *
 * Import GSAP from *this* module everywhere in the app, never from 'gsap'
 * directly. Plugin registration must happen exactly once and before first use;
 * routing it through a single module is what guarantees that.
 *
 *   import { gsap, ScrollTrigger, useGSAP } from '@/animations'
 *
 * Registering `useGSAP` as a plugin lets GSAP attach its cleanup lifecycle to
 * React's — every tween and ScrollTrigger created inside a `useGSAP()` scope is
 * reverted on unmount, which is what keeps React 19 StrictMode's double-mount
 * from leaving duplicate, half-torn-down animations behind.
 */
gsap.registerPlugin(useGSAP, ScrollTrigger)

/** House defaults so individual tweens only declare what differs. */
gsap.defaults({
  ease: 'power3.out',
  duration: DURATION.slow,
})

/**
 * `ignoreMobileResize` stops mobile browsers' collapsing address bar from
 * firing a refresh and jolting pinned sections mid-scroll.
 */
ScrollTrigger.config({
  ignoreMobileResize: true,
})

/**
 * Recalculate every trigger's start/end positions.
 *
 * Call after anything that changes document height outside React's knowledge:
 * fonts finishing load, images decoding, an accordion opening. `SmoothScroll`
 * already wires this to Lenis and to the font-loading promise.
 */
export function refreshScrollTriggers() {
  ScrollTrigger.refresh()
}

/**
 * Additional GSAP plugins (SplitText, Draggable, MotionPath, Flip, …) ship in
 * the same package. Add them to the `registerPlugin` call above as needed:
 *
 *   import { SplitText } from 'gsap/SplitText'
 *   gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText)
 */

export { gsap, ScrollTrigger, useGSAP }
