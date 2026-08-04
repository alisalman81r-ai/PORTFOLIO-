import { gsap, ScrollTrigger } from './gsap'

/**
 * GSAP ScrollTrigger factories.
 *
 * WHY FACTORIES INSTEAD OF INLINE TWEENS
 * --------------------------------------
 * Scroll-driven animation is where portfolios usually rot: every section grows
 * its own slightly-different ScrollTrigger, with `start`/`end` strings copied
 * and tweaked until nothing is consistent and nothing is safely removable.
 * Centralising the patterns means the scroll *feel* is one decision, and every
 * trigger is created and destroyed the same way.
 *
 * WHY GSAP HERE AND MOTION ELSEWHERE
 * ----------------------------------
 * Motion is better at discrete state (enter/exit, layout, gestures). GSAP is
 * better at continuous, scrubbed timelines tied to scroll position — and its
 * ScrollTrigger is already frame-synced to Lenis in `layouts/SmoothScroll.jsx`.
 * Motion's own `useScroll` runs on a separate listener and would sit a frame
 * behind that sync, which is visible on pinned elements.
 *
 * CLEANUP
 * -------
 * Every factory returns the created instance so it can be killed. Call them
 * inside `useGSAP()` and cleanup is automatic — GSAP reverts everything created
 * in that scope on unmount, which is what keeps StrictMode's double-mount from
 * leaving duplicate triggers behind.
 *
 * @example
 * useGSAP(() => {
 *   createParallax(imageRef.current, { speed: 0.25 })
 * }, { scope: sectionRef })
 */

/**
 * True when the user has asked their OS to minimise motion.
 *
 * Checked imperatively rather than via the hook because these factories run
 * outside React's render cycle. Scroll-linked motion is the single worst
 * offender for vestibular discomfort, so every factory bails on it entirely
 * rather than merely running faster.
 *
 * @returns {boolean}
 */
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Move an element at a different rate than the page as it scrolls past.
 *
 * Depth comes from *relative* speed, so subtlety matters — a speed above ~0.4
 * stops reading as parallax and starts reading as a bug. Applied to an image
 * inside `overflow-hidden`, scale the image ~1.2× so its edges never enter the
 * frame at the extremes of travel.
 *
 * @param {Element|null} target Element to move.
 * @param {object} [options]
 * @param {number} [options.speed=0.2] Fraction of the trigger's scroll distance
 *   to travel. Positive lags behind the scroll, negative runs ahead of it.
 * @param {'x'|'y'} [options.axis='y'] Axis of travel.
 * @param {Element} [options.trigger] Element whose position drives the effect.
 *   Defaults to `target` — pass the wrapper when animating an oversized child.
 * @param {string} [options.start='top bottom'] ScrollTrigger start.
 * @param {string} [options.end='bottom top'] ScrollTrigger end.
 * @param {number|boolean} [options.scrub=true] `true` locks to the scrollbar;
 *   a number adds that many seconds of catch-up smoothing.
 * @returns {gsap.core.Tween|null} Null if the target is missing or motion is reduced.
 */
export function createParallax(target, options = {}) {
  if (!target || prefersReducedMotion()) return null

  const {
    speed = 0.2,
    axis = 'y',
    trigger = target,
    start = 'top bottom',
    end = 'bottom top',
    scrub = true,
  } = options

  // Expressed as a percentage of the element's own size so the effect scales
  // with the element instead of needing per-breakpoint pixel values.
  const distance = `${speed * 100}%`

  return gsap.fromTo(
    target,
    { [axis]: `${-speed * 50}%` },
    {
      [axis]: distance,
      ease: 'none', // scrubbed motion must be linear — the scroll IS the easing
      scrollTrigger: { trigger, start, end, scrub, invalidateOnRefresh: true },
    },
  )
}

/**
 * Pin a section in place while the page continues to scroll past it.
 *
 * The mechanism behind "the page stops and the content changes" sequences.
 * Returns the ScrollTrigger so a timeline can be attached to its progress.
 *
 * `anticipatePin` pre-applies the pin a fraction early, which removes the
 * one-frame jump that is otherwise visible on fast scroll.
 *
 * @param {Element|null} trigger Section to pin.
 * @param {object} [options]
 * @param {Element} [options.pin] Element to pin, if not the trigger itself.
 * @param {string} [options.start='top top']
 * @param {string} [options.end='+=100%'] How far the page scrolls while pinned.
 *   `+=100%` means one extra viewport height.
 * @param {number|boolean} [options.scrub=true]
 * @param {gsap.core.Animation} [options.animation] Timeline to scrub.
 * @param {(self: ScrollTrigger) => void} [options.onUpdate]
 * @returns {ScrollTrigger|null}
 */
export function createPinnedSection(trigger, options = {}) {
  if (!trigger || prefersReducedMotion()) return null

  const {
    pin = trigger,
    start = 'top top',
    end = '+=100%',
    scrub = true,
    animation,
    onUpdate,
  } = options

  return ScrollTrigger.create({
    trigger,
    pin,
    start,
    end,
    scrub,
    animation,
    onUpdate,
    anticipatePin: 1,
    invalidateOnRefresh: true,
  })
}

/**
 * Report scroll progress through an element as a 0–1 value.
 *
 * For reading progress bars, section-aware nav highlighting, and driving
 * non-GSAP state (a canvas, a WebGL uniform, a React setState).
 *
 * The callback fires on every scroll frame, so keep it cheap — write to a DOM
 * property or a ref. Calling React `setState` here re-renders the tree ~60×
 * per second and will drop frames.
 *
 * @param {Element|null} trigger Element to measure, or `document.body` for the page.
 * @param {(progress: number) => void} onProgress Receives 0 at start, 1 at end.
 * @param {object} [options]
 * @param {string} [options.start='top top']
 * @param {string} [options.end='bottom bottom']
 * @returns {ScrollTrigger|null}
 */
export function createScrollProgress(trigger, onProgress, options = {}) {
  if (!trigger || typeof onProgress !== 'function') return null

  const { start = 'top top', end = 'bottom bottom' } = options

  return ScrollTrigger.create({
    trigger,
    start,
    end,
    onUpdate: (self) => onProgress(self.progress),
  })
}

/**
 * Drive a horizontal track with vertical scroll.
 *
 * The classic showcase pattern: the section pins, and scrolling moves a wide
 * row sideways.
 *
 * The scroll distance is derived from the track's actual overflow width rather
 * than hardcoded, so adding a card changes the pin duration automatically. It
 * is recalculated on refresh via a function value, which is what keeps it
 * correct after a resize or a font-driven reflow.
 *
 * @param {Element|null} container Section to pin.
 * @param {Element|null} track Wide element that moves horizontally.
 * @param {object} [options]
 * @param {number|boolean} [options.scrub=1] Seconds of catch-up smoothing.
 * @returns {gsap.core.Tween|null}
 */
export function createHorizontalScroll(container, track, options = {}) {
  if (!container || !track || prefersReducedMotion()) return null

  const { scrub = 1 } = options
  const overflow = () => Math.max(0, track.scrollWidth - container.offsetWidth)

  return gsap.to(track, {
    x: () => -overflow(),
    ease: 'none',
    scrollTrigger: {
      trigger: container,
      start: 'top top',
      end: () => `+=${overflow()}`,
      pin: true,
      scrub,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  })
}
