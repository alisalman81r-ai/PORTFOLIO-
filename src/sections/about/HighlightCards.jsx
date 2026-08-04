import { Stagger, StaggerItem } from '@/components/animations'
import { Icon, TiltCard } from '@/components/ui'
import { ABOUT } from '@/data'
import { cn } from '@/utils'

/**
 * The four pillar cards.
 *
 * WHY NOT `card-interactive`
 * -------------------------
 * That class lifts the card with a CSS `transform` on hover — and `TiltCard`
 * writes `transform` inline from motion values on the same element. Inline
 * styles always win, so the CSS lift would be silently dropped and the two
 * effects would fight for the whole hover duration.
 *
 * So the split is deliberate: `TiltCard` owns transform, and hover changes only
 * colour and border. `group` on the tilted element lets the inner pieces
 * respond without any of them touching transform.
 *
 * `items-stretch` plus `h-full` down the chain keeps all four cards the same
 * height regardless of description length — ragged card bottoms are the fastest
 * way to make a considered grid look unconsidered.
 */
export function HighlightCards({ className }) {
  return (
    <Stagger
      as="ul"
      className={cn('grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-4', className)}
    >
      {ABOUT.pillars.map((pillar) => (
        <StaggerItem as="li" key={pillar.id} className="h-full">
          <TiltCard
            intensity={6}
            className={cn(
              'card card-glass group h-full rounded-card',
              'transition-colors duration-base ease-out-quart',
              'hover:border-line-strong hover:bg-elevated',
            )}
          >
            <span
              className={cn(
                'grid size-11 place-items-center rounded-input border border-line bg-surface',
                'transition-colors duration-base ease-out-quart',
                'group-hover:border-accent/40 group-hover:bg-accent-soft',
              )}
            >
              <Icon
                name={pillar.icon}
                className="size-5 text-muted transition-colors duration-base group-hover:text-accent"
              />
            </span>

            {/* h4 because the section heading is h2 and the block label is h3 —
                the outline stays continuous, which is how screen-reader users
                navigate a long page. */}
            <h4 className="mt-5 font-display text-base font-medium text-ink">
              {pillar.title}
            </h4>

            <p className="mt-2 text-body-sm text-muted">{pillar.description}</p>
          </TiltCard>
        </StaggerItem>
      ))}
    </Stagger>
  )
}
