import { memo } from 'react'

import { Icon, TiltCard } from '@/components/ui'
import { StaggerItem } from '@/components/animations'
import { cn } from '@/utils'

/**
 * One service card.
 *
 * WHY THE TILT AND THE HOVER STYLING ARE SPLIT
 * `TiltCard` writes `transform` inline from motion values. Any CSS hover that
 * also sets `transform` — `card-interactive`, `hover-lift` — loses silently to
 * the inline style. So tilt owns transform, and hover changes colour, border
 * and shadow only. `group` lets the inner pieces respond without touching it.
 *
 * The CTA is an anchor to `#contact` rather than a button: it navigates, and a
 * `<button>` that changes the URL is a link wearing the wrong element. It
 * stretches over the whole card via `::after` (`before:absolute inset-0`
 * pattern below), so the entire card is one click target — while remaining a
 * single tab stop with a proper accessible name.
 *
 * `memo` because the grid re-renders whenever anything above it changes, and
 * the `service` prop is a stable module constant — the shallow compare is a
 * reference check that always short-circuits.
 *
 * @param {object} props
 * @param {import('@/data/services').Service} props.service
 */
export const ServiceCard = memo(function ServiceCard({ service }) {
  return (
    <StaggerItem as="li" className="h-full">
      <TiltCard
        intensity={6}
        className={cn(
          'card card-glass group h-full rounded-card',
          'flex flex-col',
          'transition-[background-color,border-color,box-shadow] duration-base ease-out-quart',
          'hover:border-accent/30 hover:bg-elevated hover:shadow-glow',
          // Focus ring for the stretched link — the anchor itself has no box,
          // so without this a keyboard user gets a ring around nothing.
          'focus-within:outline-2 focus-within:outline-offset-4 focus-within:outline-accent',
        )}
      >
        <span
          className={cn(
            'grid size-12 shrink-0 place-items-center rounded-input border border-line bg-surface',
            'transition-colors duration-base ease-out-quart',
            'group-hover:border-accent/40 group-hover:bg-accent-soft',
          )}
        >
          <Icon
            name={service.icon}
            className="size-5 text-muted transition-colors duration-base group-hover:text-accent"
          />
        </span>

        {/* h3: the section heading is h2, so the outline stays continuous. */}
        <h3 className="mt-6 font-display text-lg font-medium text-ink">{service.title}</h3>

        <p className="mt-3 text-body-sm text-muted">{service.description}</p>

        <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
          {service.deliverables.map((deliverable) => (
            <li key={deliverable} className="flex items-center gap-2 text-body-sm text-faint">
              <Icon name="check" className="size-3.5 shrink-0 text-accent" />
              {deliverable}
            </li>
          ))}
        </ul>

        {/* `mt-auto` pins the CTA to the bottom regardless of description
            length, so a row of cards has its actions on one line. */}
        <div className="mt-auto pt-6">
          <a
            href="#contact"
            // Names the service, so a screen-reader user hearing a list of
            // links is not given six identical "Discuss a build".
            aria-label={`${service.cta} — ${service.title}`}
            className={cn(
              'btn btn-outline btn-sm group/cta',
              // Stretches the link over the whole card without nesting the card
              // inside an anchor, which would swallow any future inner links.
              'after:absolute after:inset-0 after:rounded-[inherit] after:content-[""]',
            )}
          >
            {service.cta}
            <Icon
              name="arrow"
              className="size-4 transition-transform duration-base ease-out-expo group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5"
            />
          </a>
        </div>
      </TiltCard>
    </StaggerItem>
  )
})
