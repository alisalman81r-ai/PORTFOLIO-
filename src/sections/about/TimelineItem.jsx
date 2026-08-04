import { motion } from 'motion/react'

import { Reveal } from '@/components/animations'
import { Icon, Tag } from '@/components/ui'
import { SPRING, VIEWPORT, fadeInUp } from '@/animations'
import { cn } from '@/utils'

/**
 * One milestone on the journey rail.
 *
 * LAYOUT
 * The node is absolutely positioned against the `<li>` and the content is
 * inset past it, so the rail, node, and text align on every viewport without a
 * separate mobile layout. That is what makes the timeline "stack naturally":
 * there is only one arrangement, and it already works narrow.
 *
 * The node sits *outside* the `Reveal` wrapper on purpose. Inside it, the
 * wrapper would become the positioning context and the node would land 56px
 * off — and it would inherit the content's slide-up rather than getting its own
 * spring.
 *
 * ALIGNMENT
 * The meta row is exactly as tall as the node (`h-10`) so their centres line
 * up. Aligning to the top instead leaves the 40px node visibly floating above a
 * 12px label.
 *
 * @param {object} props
 * @param {import('@/data/timeline').Milestone} props.milestone
 * @param {boolean} props.isLast Removes trailing space on the final entry.
 */
export function TimelineItem({ milestone, isLast }) {
  const { year, title, description, icon, current } = milestone

  return (
    <li className={cn('relative pl-14 sm:pl-16', !isLast && 'pb-10 sm:pb-12')}>
      {/* Node. Opaque background so the rail does not show through it, and
          raised above the rail so the line appears to pass behind. */}
      <motion.span
        aria-hidden="true"
        initial={{ scale: 0.4, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ ...VIEWPORT, once: true }}
        transition={SPRING.snappy}
        className={cn(
          'absolute top-0 left-0 z-raised grid size-10 place-items-center rounded-full border bg-canvas',
          current
            ? 'border-accent/50 bg-accent-soft text-accent'
            : 'border-line text-muted',
        )}
      >
        <Icon name={icon} className="size-[1.15rem]" />

        {/* Halo on the active entry only. Two layers — a static core and an
            expanding ring — so it reads as a live signal rather than a spinner. */}
        {current && (
          <span className="absolute inset-0 animate-ping rounded-full border border-accent/40" />
        )}
      </motion.span>

      <Reveal variants={fadeInUp} delay={0.08}>
        <div className="flex h-10 items-center gap-3">
          <span className="eyebrow">{year}</span>
          {current && <Tag tone="accent">Now</Tag>}
        </div>

        <h4 className="mt-1 font-display text-lg font-medium text-ink sm:text-xl">
          {title}
        </h4>

        <p className="mt-2 max-w-prose text-body-sm text-muted">{description}</p>
      </Reveal>
    </li>
  )
}
