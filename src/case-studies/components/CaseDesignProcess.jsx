import { CaseSection } from './CaseSection'
import { Reveal } from '@/components/animations'
import { Icon, ImageFrame } from '@/components/ui'
import { cn } from '@/utils'

/**
 * Section 5 — Design process.
 *
 * Planning, research, wireframes, UI, UX — as an alternating sequence rather
 * than a row of equal cards. The alternation is doing work: a five-card grid
 * says these phases were parallel and interchangeable, and a staggered sequence
 * says they happened in an order, which is the actual claim.
 *
 * PHASES WITH ARTEFACTS AND PHASES WITHOUT
 * Wireframes and UI design produce something you can look at; planning and
 * research produce decisions. So the image frame only renders for phases that
 * declare one — and when the artefact has not been exported yet, the frame
 * renders empty with a hint naming exactly what belongs there. An empty frame
 * that asks for a wireframe is honest. A stock photograph of a notebook is not.
 */
export function CaseDesignProcess({ design }) {
  if (!design?.length) return null

  return (
    <CaseSection
      id="design"
      step="04"
      eyebrow="Design process"
      icon="palette"
      title="How the design was arrived at"
      lead="Structure before surface. Every phase below closed a question that would otherwise have been answered later, more expensively."
    >
      <ol className="relative">
        {design.map((phase, index) => {
          const hasArtefact = 'image' in phase
          const isReversed = index % 2 === 1

          return (
            <li
              key={phase.id}
              className={cn('relative', index > 0 && 'mt-14 lg:mt-20')}
            >
              <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-14">
                <Reveal
                  className={cn(
                    'lg:col-span-6',
                    // Order rather than DOM reversal, so the reading order stays
                    // phase-then-artefact for a screen reader regardless of which
                    // side the image lands on.
                    isReversed ? 'lg:order-2' : 'lg:order-1',
                    !hasArtefact && 'lg:col-span-8 lg:col-start-3 lg:order-1',
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-input border border-line bg-surface">
                      <Icon name={phase.icon} className="size-4 text-accent" />
                    </span>
                    <span aria-hidden="true" className="font-mono text-xs tracking-wider-caps text-faint uppercase">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* h3: the section heading is h2. */}
                  <h3 className="heading-xs mt-5 text-ink">{phase.label}</h3>
                  <p className="mt-4 text-body-sm text-muted">{phase.description}</p>

                  {phase.points?.length > 0 && (
                    <ul className="mt-5 flex flex-col gap-2.5">
                      {phase.points.map((point) => (
                        <li key={point} className="flex items-start gap-3">
                          <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-accent-soft">
                            <Icon name="check" className="size-3 text-accent" />
                          </span>
                          <span className="text-body-sm text-muted">{point}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </Reveal>

                {hasArtefact && (
                  <Reveal
                    delay={0.1}
                    className={cn('lg:col-span-6', isReversed ? 'lg:order-1' : 'lg:order-2')}
                  >
                    <ImageFrame
                      src={phase.image}
                      alt={phase.image ? phase.label + ' — ' + phase.imageHint : ''}
                      ratio="video"
                      loading="lazy"
                      placeholderLabel={phase.imageHint ?? 'Add an artefact'}
                      placeholderHint="Drop the export in and set `image` on this phase"
                      className="rounded-panel border border-line"
                    />
                  </Reveal>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </CaseSection>
  )
}
