import { memo } from 'react'

import { Avatar, Icon, Rating, Tag } from '@/components/ui'
import { cn } from '@/utils'

/**
 * One testimonial slide.
 *
 * A `<figure>`/`<figcaption>` pair, not a div with a paragraph: a quotation and
 * its attribution is exactly what those elements describe, and it gives
 * assistive tech the relationship between the words and who said them for free.
 * `<blockquote>` carries the quote itself, with `cite` pointing at the source
 * when one exists.
 *
 * No `TiltCard` here, deliberately. The card lives inside a horizontally
 * scrolling track, and a pointer-driven 3D tilt fights the drag gesture that
 * moves the carousel — two different things responding to the same pointer.
 * Hover raises colour and border only.
 *
 * `memo` because the track re-renders as the active index changes, and every
 * slide would re-render with it. The `testimonial` prop is a stable module
 * constant, so the shallow compare is a reference check.
 *
 * @param {object} props
 * @param {import('@/data/testimonials').Testimonial} props.testimonial
 * @param {number} props.index
 * @param {number} props.total
 */
export const TestimonialCard = memo(function TestimonialCard({ testimonial, index, total }) {
  return (
    <figure
      // `aria-roledescription` tells a screen reader this is a slide rather
      // than a generic group, and the label gives it a position in the set.
      role="group"
      aria-roledescription="slide"
      aria-label={`Testimonial ${index + 1} of ${total}`}
      className={cn(
        'card card-glass group flex h-full flex-col rounded-panel',
        // `snap-center` pairs with the track's scroll-snap; `shrink-0` stops
        // flex from compressing slides to fit instead of overflowing.
        'w-[85vw] shrink-0 snap-center sm:w-[26rem] lg:w-[30rem]',
        'transition-[background-color,border-color,box-shadow] duration-base ease-out-quart',
        'hover:border-accent/30 hover:bg-elevated hover:shadow-glow',
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <Icon
          name="quote"
          className="size-8 text-accent/30 transition-colors duration-base group-hover:text-accent/60"
        />
        <Rating value={testimonial.rating} />
      </div>

      <blockquote cite={testimonial.sourceUrl || undefined} className="mt-6 flex-1">
        <p className="text-body-lg text-ink">{testimonial.quote}</p>
      </blockquote>

      <figcaption className="mt-8 flex items-center gap-4 border-t border-line pt-6">
        <Avatar src={testimonial.avatar} name={testimonial.author} size="md" />

        <div className="min-w-0">
          <p className="truncate text-body-sm font-medium text-ink">{testimonial.author}</p>
          <p className="truncate text-body-sm text-muted">
            {testimonial.role}
            {testimonial.company ? `, ${testimonial.company}` : ''}
          </p>
        </div>

        <Tag tone="outline" className="ml-auto hidden sm:inline-flex">
          {testimonial.projectType}
        </Tag>
      </figcaption>
    </figure>
  )
})
