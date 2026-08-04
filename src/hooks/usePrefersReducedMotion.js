import { useMediaQuery } from './useMediaQuery'

/**
 * Whether the user has asked the OS to minimise animation.
 *
 * The CSS media query in `styles/base.css` neutralises CSS transitions and
 * keyframes, but it cannot touch JS-driven motion. Use this hook to skip GSAP
 * timelines, disable Lenis, and drop parallax entirely — the correct response
 * is usually *no* animation, not a faster one.
 *
 * @returns {boolean}
 *
 * @example
 * const reduced = usePrefersReducedMotion()
 * useGSAP(() => {
 *   if (reduced) return
 *   gsap.from('.card', { y: 40, stagger: 0.1 })
 * }, { scope: container, dependencies: [reduced] })
 */
export function usePrefersReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}
