import { motion } from 'motion/react'

import { Reveal } from '@/components/animations'
import { Icon, Tag } from '@/components/ui'
import { SPRING, VIEWPORT, fadeInUp } from '@/animations'
import { EXPERIENCE_TYPES } from '@/data'
import { formatDateRange } from '@/utils'
import { cn } from '@/utils'

/** Node glyph per entry type — a job and a learning streak are not the same thing. */
const TYPE_ICONS = {
  freelance: 'briefcase',
  client: 'milestone',
  personal: 'code',
  learning: 'learning',
}

/**
 * One entry on the experience rail.
 *
 * DATES
 * Prefers ISO `start`/`end` rendered through `formatDateRange()`, which sorts,
 * localises, and computes "Present" from a null `end` so a current role never
 * goes stale. Falls back to the `period` display string while the real dates
 * are unknown — that fallback is why the timeline works today and needs no
 * component change once they are filled in.
 *
 * LAYOUT
 * The node is absolutely positioned against the `<li>` and the content insets
 * past it, so the rail, node and card align at every width without a separate
 * mobile layout. That is what makes it stack naturally: there is one
 * arrangement, and it already works narrow.
 *
 * The node sits *outside* the `Reveal` wrapper deliberately — inside it, the
 * wrapper would become the positioning context and the node would land 64px
 * off, and it would inherit the card's slide rather than getting its own spring.
 *
 * @param {object} props
 * @param {import('@/data/experience').ExperienceEntry} props.entry
 * @param {boolean} props.isLast Removes trailing space on the final entry.
 */
export function ExperienceItem({ entry, isLast }) {
  const type = EXPERIENCE_TYPES[entry.type] ?? EXPERIENCE_TYPES.personal
  const dates = entry.start ? formatDateRange(entry.start, entry.end) : entry.period

  return (
    <li className={cn('relative pl-16 sm:pl-20', !isLast && 'pb-12 sm:pb-16')}>
      <motion.span
        aria-hidden="true"
        initial={{ scale: 0.4, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ ...VIEWPORT, once: true }}
        transition={SPRING.snappy}
        className={cn(
          'absolute top-0 left-0 z-raised grid size-11 place-items-center rounded-full border bg-canvas',
          entry.current
            ? 'border-accent/50 bg-accent-soft text-accent'
            : 'border-line text-muted',
        )}
      >
        <Icon name={TYPE_ICONS[entry.type] ?? 'briefcase'} className="size-5" />

        {entry.current && (
          <span className="absolute inset-0 animate-ping rounded-full border border-accent/40" />
        )}
      </motion.span>

      <Reveal variants={fadeInUp} delay={0.08}>
        <div className="card card-glass rounded-card transition-colors duration-base hover:border-line-strong">
          <div className="flex flex-wrap items-center gap-2">
            <Tag tone={type.tone}>{type.label}</Tag>
            <span className="eyebrow flex text-faint">{dates}</span>
          </div>

          {/* h3: the section heading is h2, so the outline stays continuous. */}
          <h3 className="mt-4 font-display text-lg font-medium text-ink sm:text-xl">
            {entry.role}
          </h3>

          <p className="mt-1 text-body-sm text-accent">{entry.context}</p>

          <p className="mt-4 max-w-prose text-body-sm text-muted">{entry.description}</p>

          <ul className="mt-5 flex flex-col gap-2.5">
            {entry.highlights.map((highlight) => (
              <li key={highlight} className="flex items-start gap-3">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-accent-soft">
                  <Icon name="check" className="size-3 text-accent" />
                </span>
                <span className="text-body-sm text-muted">{highlight}</span>
              </li>
            ))}
          </ul>

          <ul className="mt-6 flex flex-wrap gap-2 border-t border-line pt-5">
            {entry.technologies.map((tech) => (
              <Tag as="li" key={tech}>
                {tech}
              </Tag>
            ))}
          </ul>
        </div>
      </Reveal>
    </li>
  )
}
