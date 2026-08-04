import { useRef } from 'react'

import { TimelineItem } from './TimelineItem'
import { gsap, useGSAP } from '@/animations'
import { JOURNEY } from '@/data'
import { usePrefersReducedMotion } from '@/hooks'
import { cn } from '@/utils'

/**
 * Vertical journey rail.
 *
 * THE PROGRESS LINE
 * -----------------
 * A second line is overlaid on the track and scaled from 0 to 1 as the section
 * passes through the viewport, so the rail fills as you read. It is driven by
 * GSAP rather than Motion's `useScroll` for a specific reason: ScrollTrigger is
 * already frame-synced to Lenis in `layouts/SmoothScroll.jsx`, while Motion's
 * scroll listener runs independently and would sit a frame behind — visible as
 * the line lagging the content it is meant to track.
 *
 * `scrub: true` ties progress to scroll position rather than to time, so
 * scrolling back up unwinds it. `scaleY` on a 1px element is a compositor-only
 * operation: no layout, no paint, regardless of how long the list grows.
 *
 * The start/end offsets (`top 75%` → `bottom 65%`) mean the line completes
 * slightly before the last milestone leaves the viewport, so it reads as
 * finished rather than cut off.
 *
 * `useGSAP` scopes the trigger to this component and reverts it on unmount,
 * which is what prevents StrictMode's double-mount from leaving a duplicate
 * ScrollTrigger attached to a detached node.
 */
export function Timeline({ className }) {
  const containerRef = useRef(null)
  const progressRef = useRef(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  useGSAP(
    () => {
      if (!progressRef.current) return

      // Scroll-linked motion is the worst offender for vestibular discomfort,
      // so it is not slowed here — it is replaced with the finished state.
      if (prefersReducedMotion) {
        gsap.set(progressRef.current, { scaleY: 1 })
        return
      }

      gsap.fromTo(
        progressRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none', // scrubbed motion must be linear — the scroll is the easing
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 75%',
            end: 'bottom 65%',
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      )
    },
    { scope: containerRef, dependencies: [prefersReducedMotion] },
  )

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {/* Track. Fades out at the bottom instead of stopping abruptly — the rail
          ends past the final node, and a hard cut looks like a rendering error. */}
      <span
        aria-hidden="true"
        className="absolute top-5 bottom-5 left-5 w-px bg-gradient-to-b from-line via-line to-transparent"
      />

      {/* Fill. Same geometry, scaled from the top. */}
      <span
        ref={progressRef}
        aria-hidden="true"
        className="absolute top-5 bottom-5 left-5 w-px origin-top scale-y-0 bg-gradient-to-b from-accent to-accent-alt"
      />

      {/* An ordered list because the sequence carries meaning — assistive tech
          announces position and count, which is most of what a timeline is. */}
      <ol className="relative">
        {JOURNEY.map((milestone, index) => (
          <TimelineItem
            key={milestone.id}
            milestone={milestone}
            isLast={index === JOURNEY.length - 1}
          />
        ))}
      </ol>
    </div>
  )
}
