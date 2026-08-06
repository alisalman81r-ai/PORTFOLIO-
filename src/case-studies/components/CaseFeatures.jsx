import { CaseSection } from './CaseSection'
import { Stagger, StaggerItem } from '@/components/animations'
import { Icon } from '@/components/ui'
import { scaleIn } from '@/animations'
import { cn } from '@/utils'

/**
 * Section 7 — Features.
 *
 * Read from the project record rather than restated in the case study file, so
 * the features listed here are the same ones on the projects grid. Two lists
 * would disagree the first time either was edited.
 *
 * The numbering is deliberate. Feature grids are the most skimmed part of any
 * case study, and an index gives the eye somewhere to land — it turns six
 * equal-weight cards into a sequence a reader can leave and re-enter.
 *
 * Cards scale in rather than rising: they are discrete objects in a grid, not a
 * narrative sequence, and the entrance vector should say so. See the guide in
 * `animations/variants.js`.
 */
export function CaseFeatures({ features }) {
  if (!features?.length) return null

  return (
    <CaseSection
      id="features"
      step="06"
      eyebrow="Features"
      icon="sparkles"
      title="What it actually does"
    >
      <Stagger as="ul" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <StaggerItem as="li" key={feature.title} variants={scaleIn} className="h-full">
            <div
              className={cn(
                'card card-glass group relative flex h-full flex-col overflow-hidden rounded-card',
                'transition-[background-color,border-color,box-shadow] duration-base ease-out-quart',
                'hover:border-accent/30 hover:bg-elevated hover:shadow-glow',
              )}
            >
              {/* Index, set large in the corner. `aria-hidden` because "01"
                  announced before every feature name is noise — the heading
                  below carries the meaning.

                  Coloured `text-faint` rather than `text-line-strong`, which was
                  the first choice and measured 1.89:1 against the card. Hiding
                  it from assistive tech does not exempt it from contrast: it is
                  still text, sighted readers still see it, and a numeral nobody
                  can quite read is worse than one that is simply quiet. `--faint`
                  was tuned during the accessibility pass to clear AA, so this
                  stays inside the design system rather than inventing a value. */}
              <span
                aria-hidden="true"
                className="absolute top-4 right-5 font-mono text-2xl text-faint transition-colors duration-base group-hover:text-accent"
              >
                {String(index + 1).padStart(2, '0')}
              </span>

              <span className="grid size-10 place-items-center rounded-input border border-line bg-surface transition-colors duration-base group-hover:border-accent/40 group-hover:bg-accent-soft">
                <Icon name="check" className="size-4 text-accent" />
              </span>

              {/* h3: the section heading is h2, so the outline stays continuous. */}
              <h3 className="mt-5 pr-10 text-body-sm font-medium text-ink">{feature.title}</h3>
              <p className="mt-2 text-body-sm text-muted">{feature.description}</p>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </CaseSection>
  )
}
