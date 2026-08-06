import { Section } from '@/layouts'
import { Stagger, StaggerItem } from '@/components/animations'
import { scaleIn } from '@/animations'
import { Counter, GlowOrb, Icon, SectionHeader } from '@/components/ui'
import { ACHIEVEMENTS, ACHIEVEMENTS_META } from '@/data'
import { cn } from '@/utils'

/**
 * Achievements — four counters that animate into view.
 *
 * A single file, not a folder: there is one repeated block and it is small
 * enough to read in place. The counting itself lives in `<Counter>` because it
 * is genuinely reusable and the performance detail in it (writing `textContent`
 * rather than re-rendering sixty times a second, per counter) belongs in one
 * place.
 *
 * THE "COUNTED" MARKER
 * Two of these figures are derived from the site's own data — projects from
 * `projects.js`, technologies from `skills.js` — and carry a small marker
 * saying so. That is not decoration: a number a visitor can verify against the
 * page they are already on is worth more than one they have to take on trust,
 * and the marker makes the difference visible. It also means those two can
 * never quietly go stale.
 */
export function Achievements() {
  return (
    <Section
      id="achievements"
      labelledBy="achievements-title"
      spacing="sm"
      className="relative overflow-x-clip"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <GlowOrb
          tone="warm"
          motion="drift"
          className="top-[-10%] left-[30%] size-[50vw] max-w-[600px]"
        />
      </div>

      <div className="relative">
        <SectionHeader
          id="achievements-title"
          badge={ACHIEVEMENTS_META.badge}
          headline={ACHIEVEMENTS_META.headline}
          intro={ACHIEVEMENTS_META.intro}
          align="center"
        />

        <Stagger
          as="ul"
          className="mt-14 grid items-stretch gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4"
        >
          {ACHIEVEMENTS.map((achievement) => (
            <StaggerItem as="li" key={achievement.id} variants={scaleIn} className="h-full">
              <div
                className={cn(
                  // `flex-col` so the derived marker can be pinned to the
                  // bottom — otherwise it floats at a different height on each
                  // card depending on how the detail line wraps.
                  'card card-glass group flex h-full flex-col rounded-card text-center',
                  'transition-[background-color,border-color,box-shadow] duration-base ease-out-quart',
                  'hover:border-accent/30 hover:bg-elevated hover:shadow-glow',
                )}
              >
                <span
                  className={cn(
                    'mx-auto grid size-11 place-items-center rounded-input border border-line bg-surface',
                    'transition-colors duration-base ease-out-quart',
                    'group-hover:border-accent/40 group-hover:bg-accent-soft',
                  )}
                >
                  <Icon
                    name={achievement.icon}
                    className="size-5 text-muted transition-colors duration-base group-hover:text-accent"
                  />
                </span>

                {/* The figure is the headline here, so it gets display type and
                    the gradient — the label below carries the meaning. */}
                <p className="mt-5 heading-xs text-gradient">
                  <Counter
                    value={achievement.value}
                    suffix={achievement.suffix}
                    label={achievement.label}
                  />
                </p>

                {/* h3: the section heading is h2, so the outline stays
                    continuous. The number above is not a heading — it is the
                    value this heading names. */}
                <h3 className="mt-2 text-body-sm font-medium text-ink">
                  {achievement.label}
                </h3>

                <p className="mt-2 text-body-sm text-faint">{achievement.detail}</p>

                {achievement.derived && (
                  <p className="mt-auto flex items-center justify-center gap-1.5 pt-4 font-mono text-[0.625rem] tracking-wider-caps text-faint uppercase">
                    <Icon name="check" className="size-3 text-accent" />
                    Counted from site data
                  </p>
                )}
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  )
}
