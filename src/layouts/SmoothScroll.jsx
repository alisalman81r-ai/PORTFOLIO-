import { useEffect, useMemo } from 'react'
import { ReactLenis, useLenis } from 'lenis/react'
import 'lenis/dist/lenis.css'

import { gsap, ScrollTrigger } from '@/animations'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

/**
 * Baseline Lenis configuration.
 *
 * `autoRaf: false` is the important one — Lenis is stepped by GSAP's ticker in
 * `LenisGsapSync` below instead of starting a second rAF loop of its own.
 *
 * `syncTouch: false` leaves touch devices on native momentum scrolling.
 * Synthesised touch scroll fights the OS rubber-banding and consistently feels
 * worse than the real thing on iOS.
 */
const DEFAULT_OPTIONS = {
  autoRaf: false,
  lerp: 0.1,
  smoothWheel: true,
  syncTouch: false,
  touchMultiplier: 1.4,
  wheelMultiplier: 1,
  overscroll: false,
}

/**
 * Options that make Lenis behave like native scrolling, for users who have
 * asked to reduce motion. The instance stays mounted rather than being removed
 * so `useLenis`-based hooks keep receiving scroll events either way.
 */
const REDUCED_OPTIONS = {
  ...DEFAULT_OPTIONS,
  lerp: 1,
  smoothWheel: false,
  touchMultiplier: 1,
}

/**
 * Binds the Lenis instance to GSAP. Renders nothing.
 *
 * This lives in a child component rather than in `SmoothScroll` itself because
 * `ReactLenis` constructs its instance inside its *own* effect — a parent's
 * effect runs first and would see nothing. `useLenis()` subscribes to the store
 * that instance is published to, so this re-runs the moment it exists.
 *
 * The wiring, in order:
 *
 *   1. Lenis is stepped from `gsap.ticker`, so Lenis, GSAP tweens, and
 *      ScrollTrigger all resolve inside a single frame. Two competing rAF loops
 *      produce a one-frame lag that shows up as pinned elements drifting.
 *   2. `lagSmoothing(0)` stops GSAP from skipping ahead after a long frame,
 *      which would otherwise desync scroll position from animation progress.
 *   3. ScrollTrigger updates on Lenis's scroll event rather than the browser's.
 */
function LenisGsapSync() {
  const lenis = useLenis()

  useEffect(() => {
    if (!lenis) return

    // gsap.ticker reports seconds; Lenis expects milliseconds.
    const update = (time) => lenis.raf(time * 1000)

    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)
    lenis.on('scroll', ScrollTrigger.update)

    return () => {
      gsap.ticker.remove(update)
      gsap.ticker.lagSmoothing(500, 33) // restore GSAP's defaults
      lenis.off('scroll', ScrollTrigger.update)
    }
  }, [lenis])

  return null
}

/**
 * Smooth-scroll provider.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {object} [props.options] Lenis options, merged over the defaults.
 */
export function SmoothScroll({ children, options }) {
  const prefersReducedMotion = usePrefersReducedMotion()

  const lenisOptions = useMemo(
    () => ({ ...(prefersReducedMotion ? REDUCED_OPTIONS : DEFAULT_OPTIONS), ...options }),
    [prefersReducedMotion, options],
  )

  useEffect(() => {
    // Native smooth scrolling would fight Lenis's programmatic scrollTo.
    // It stays in the markup as the no-JS fallback and is dropped here.
    document.documentElement.classList.remove('scroll-smooth')
  }, [])

  // Webfonts reflow text, which changes document height and therefore every
  // trigger's start/end positions.
  useEffect(() => {
    let cancelled = false

    document.fonts?.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh()
    })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <ReactLenis root options={lenisOptions}>
      <LenisGsapSync />
      {children}
    </ReactLenis>
  )
}
