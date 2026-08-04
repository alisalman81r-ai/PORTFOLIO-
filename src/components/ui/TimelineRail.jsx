import { useRef } from 'react'

import { gsap, useGSAP } from '@/animations'
import { usePrefersReducedMotion } from '@/hooks'
import { cn } from '@/utils'

/**
 * Vertical rail whose fill tracks scroll progress through a list.
 *
 * Two absolutely-positioned 1px lines: a static track, and a fill scaled from 0
 * to 1 as the target passes through the viewport. Position it with `className`
 * so the line lands on the centre of whatever nodes it threads.
 *
 * WHY GSAP AND NOT MOTION'S `useScroll`
 * ScrollTrigger is already frame-synced to Lenis in `layouts/SmoothScroll.jsx`.
 * Motion's scroll listener runs independently and would sit a frame behind the
 * content it tracks, which is visible as the fill lagging the item beside it.
 *
 * `scaleY` on a 1px element is compositor-only — no layout, no paint —
 * regardless of how long the list grows.
 *
 * @param {object} props
 * @param {React.RefObject<HTMLElement>} props.targetRef Element whose scroll
 *   progress drives the fill. Usually the list the rail sits behind.
 * @param {string} [props.className] Position and inset, e.g. `'left-5 top-5 bottom-5'`.
 * @param {string} [props.start='top 75%'] ScrollTrigger start.
 * @param {string} [props.end='bottom 65%'] Ends slightly before the last item
 *   leaves the viewport, so the rail reads as finished rather than cut off.
 */
export function TimelineRail({
  targetRef,
  className,
  start = 'top 75%',
  end = 'bottom 65%',
}) {
  const fillRef = useRef(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  useGSAP(
    () => {
      if (!fillRef.current || !targetRef?.current) return

      // Scroll-linked motion is the worst offender for vestibular discomfort,
      // so it is replaced with the finished state rather than slowed down.
      if (prefersReducedMotion) {
        gsap.set(fillRef.current, { scaleY: 1 })
        return
      }

      gsap.fromTo(
        fillRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none', // scrubbed motion must be linear — the scroll is the easing
          scrollTrigger: {
            trigger: targetRef.current,
            start,
            end,
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      )
    },
    { dependencies: [prefersReducedMotion, start, end] },
  )

  return (
    <>
      {/* Track. Fades out at the bottom rather than stopping abruptly — the rail
          runs past the final node, and a hard cut looks like a rendering fault. */}
      <span
        aria-hidden="true"
        className={cn(
          'absolute w-px bg-gradient-to-b from-line via-line to-transparent',
          className,
        )}
      />

      {/* Fill. Identical geometry, scaled from the top. */}
      <span
        ref={fillRef}
        aria-hidden="true"
        className={cn(
          'absolute w-px origin-top scale-y-0 bg-gradient-to-b from-accent to-accent-alt',
          className,
        )}
      />
    </>
  )
}
