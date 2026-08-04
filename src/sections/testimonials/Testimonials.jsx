import { useCallback, useEffect, useRef, useState } from 'react'

import { TestimonialCard } from './TestimonialCard'
import { Section } from '@/layouts'
import { GlowOrb, Icon, SectionHeader } from '@/components/ui'
import { Reveal } from '@/components/animations'
import { fadeInUp } from '@/animations'
import { HAS_TESTIMONIALS, TESTIMONIALS, TESTIMONIALS_META } from '@/data'
import { cn } from '@/utils'

/**
 * Testimonials carousel.
 *
 * BUILT ON NATIVE SCROLL-SNAP, NOT A TRANSFORM SLIDER
 * ---------------------------------------------------
 * The track is a real scrolling element with `scroll-snap-type`, and the
 * controls call `scrollTo`. The usual alternative — translating a strip by
 * `index * width` — is worse in every way that matters here:
 *
 *   - Touch gets real momentum and rubber-banding from the OS, free. A
 *     transform slider has to reimplement both, and never quite matches.
 *   - Keyboard users can reach an off-screen slide, because it is scrolled
 *     rather than hidden. A translated strip leaves focusable content
 *     positioned outside the viewport, which browsers then scroll to
 *     unpredictably.
 *   - It degrades to a plain scrollable row if JavaScript fails.
 *   - No width measurement, so a resize cannot desynchronise it.
 *
 * The active index is derived from `scrollLeft` rather than stored as the
 * source of truth, so dragging, snapping and the buttons can never disagree
 * about which slide is showing.
 *
 * The scroll handler is coalesced to one animation frame — a scroll event can
 * fire far more often than the display refreshes, and each handler run reads
 * layout.
 *
 * ACCESSIBILITY
 *   - `aria-roledescription="carousel"` on the region, `"slide"` on each card.
 *   - Buttons disable at the ends rather than wrapping — silent wrap-around
 *     leaves a keyboard user unsure whether anything happened.
 *   - A polite live region announces the position as it changes.
 *   - The track is focusable (`tabIndex={0}`), which is what lets a keyboard
 *     user scroll it with arrow keys; without it a scrollable region is
 *     unreachable by keyboard alone.
 */
export function Testimonials() {
  const trackRef = useRef(null)
  const frameRef = useRef(0)
  const [activeIndex, setActiveIndex] = useState(0)

  const total = TESTIMONIALS.length

  // Derive the active slide from scroll position. Coalesced to one frame:
  // `scroll` can fire several times per frame and this reads layout.
  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const handleScroll = () => {
      if (frameRef.current) return

      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = 0

        const slides = [...track.children]
        if (slides.length === 0) return

        // THE ENDS ARE SPECIAL, AND THIS IS THE WHOLE BUG IN MOST CAROUSELS.
        //
        // Scrolling clamps at 0 and at max, so whenever the track is wider than
        // a slide the first and last can never actually reach the centre. A
        // pure nearest-to-centre test therefore never selects them: at 1440px
        // this opened on slide 2 and could not reach slide 4 no matter how far
        // you scrolled. Resolving the extremes by scroll position first is what
        // makes both ends reachable.
        const maxScroll = track.scrollWidth - track.clientWidth
        const TOLERANCE = 2 // sub-pixel scroll positions never land exactly on 0

        if (track.scrollLeft <= TOLERANCE) {
          setActiveIndex(0)
          return
        }

        if (track.scrollLeft >= maxScroll - TOLERANCE) {
          setActiveIndex(slides.length - 1)
          return
        }

        // Between the ends, the nearest slide to the track's centre — which is
        // what `snap-center` aligns to. Measuring from the left edge would be
        // off by half a card.
        const trackCentre = track.scrollLeft + track.clientWidth / 2
        let nearest = 0
        let smallest = Infinity

        slides.forEach((slide, index) => {
          const slideCentre = slide.offsetLeft + slide.offsetWidth / 2
          const distance = Math.abs(slideCentre - trackCentre)
          if (distance < smallest) {
            smallest = distance
            nearest = index
          }
        })

        setActiveIndex(nearest)
      })
    }

    track.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      track.removeEventListener('scroll', handleScroll)
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [])

  const scrollToIndex = useCallback((rawIndex) => {
    const track = trackRef.current
    if (!track) return

    // Clamped here rather than at every call site, so the buttons and the dots
    // cannot disagree about what a valid index is.
    const index = Math.max(0, Math.min(rawIndex, track.children.length - 1))
    const slide = track.children[index]
    if (!slide) return

    // Centre the target slide. `scrollTo` on the track — not
    // `scrollIntoView` — because that would also scroll the page vertically.
    track.scrollTo({
      left: slide.offsetLeft - (track.clientWidth - slide.offsetWidth) / 2,
      behavior: 'smooth',
    })
  }, [])

  // A single quote is not social proof — it reads as the only nice thing
  // anyone has said. The section removes itself below the threshold.
  if (!HAS_TESTIMONIALS) return null

  const atStart = activeIndex === 0
  const atEnd = activeIndex >= total - 1

  return (
    <Section
      id="testimonials"
      labelledBy="testimonials-title"
      // Contains the glows. `overflow-x-clip`, not `overflow-hidden`: hidden
      // would make this a scroll container and break `position: sticky` for
      // anything nested here later.
      className="relative overflow-x-clip"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <GlowOrb
          tone="cool"
          motion="drift"
          className="top-[5%] right-[8%] size-[55vw] max-w-[680px]"
        />
        <GlowOrb
          tone="warm"
          motion="drift-slow"
          className="bottom-[5%] left-[-8%] size-[50vw] max-w-[620px]"
        />
      </div>

      <div className="relative">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHeader
            id="testimonials-title"
            badge={TESTIMONIALS_META.badge}
            headline={TESTIMONIALS_META.headline}
            intro={TESTIMONIALS_META.intro}
          />

          {/* Controls sit beside the heading on desktop rather than under the
              track — they are reachable before the reader has scrolled past it. */}
          <Reveal variants={fadeInUp} delay={0.15} className="hidden lg:block">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollToIndex(activeIndex - 1)}
                disabled={atStart}
                aria-label="Previous testimonial"
                className="btn btn-icon btn-outline"
              >
                <Icon name="prev" className="size-5" />
              </button>

              <button
                type="button"
                onClick={() => scrollToIndex(activeIndex + 1)}
                disabled={atEnd}
                aria-label="Next testimonial"
                className="btn btn-icon btn-outline"
              >
                <Icon name="next" className="size-5" />
              </button>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Full-bleed so slides run to the viewport edge — a carousel that stops
          at the container gutter looks like a grid that failed to wrap. The
          track's own padding restores the gutter for the first and last card. */}
      <div className="relative mt-14 lg:mt-16">
        <div
          ref={trackRef}
          role="region"
          aria-roledescription="carousel"
          aria-label="Client testimonials"
          tabIndex={0}
          className={cn(
            // `relative` is load-bearing, not cosmetic. The scroll maths below
            // reads `slide.offsetLeft`, which is measured from the nearest
            // *positioned* ancestor — without this that is the section wrapper,
            // so every offset carries the section's own position and the
            // computed target lands a slide or two past the intended one.
            // Positioning the track makes it the offsetParent, putting
            // `offsetLeft` and `scrollLeft` in the same coordinate space.
            'relative no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto',
            'px-gutter pb-2 lg:gap-6',
            'focus-visible:outline-offset-4',
          )}
        >
          {TESTIMONIALS.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              index={index}
              total={total}
            />
          ))}
        </div>

        {/* Progress dots. Buttons, not decoration — they navigate. */}
        <div className="container-page mt-8 flex items-center justify-between gap-6">
          <ul className="flex items-center gap-2">
            {TESTIMONIALS.map((testimonial, index) => (
              <li key={testimonial.id}>
                {/*
                  The visible dot is 6px, but the *button* is 24px tall with a
                  transparent gutter around it. Measured at 6x6 it failed WCAG
                  2.5.8, which sets a 24x24 minimum target — a 6px tap target is
                  unusable with a thumb regardless of how it looks. `min-w-6`
                  covers the width too: padding alone left it 14px across, which
                  passes on one axis and fails on the other.

                  Padding the control rather than enlarging the dot keeps the
                  design identical and fixes the ergonomics, which is the right
                  trade every time.
                */}
                <button
                  type="button"
                  onClick={() => scrollToIndex(index)}
                  aria-label={`Go to testimonial ${index + 1}`}
                  aria-current={index === activeIndex ? 'true' : undefined}
                  className="group/dot grid h-6 min-w-6 place-items-center px-1"
                >
                  <span
                    className={cn(
                      'block h-1.5 rounded-pill transition-all duration-base ease-out-expo',
                      index === activeIndex
                        ? 'w-8 bg-accent'
                        : 'w-1.5 bg-line-strong group-hover/dot:bg-muted',
                    )}
                  />
                </button>
              </li>
            ))}
          </ul>

          {/* Mobile controls, below the track where the thumb is. */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => scrollToIndex(activeIndex - 1)}
              disabled={atStart}
              aria-label="Previous testimonial"
              className="btn btn-icon btn-outline"
            >
              <Icon name="prev" className="size-5" />
            </button>

            <button
              type="button"
              onClick={() => scrollToIndex(activeIndex + 1)}
              disabled={atEnd}
              aria-label="Next testimonial"
              className="btn btn-icon btn-outline"
            >
              <Icon name="next" className="size-5" />
            </button>
          </div>
        </div>

        <p aria-live="polite" className="sr-only">
          Testimonial {activeIndex + 1} of {total}
        </p>
      </div>
    </Section>
  )
}
