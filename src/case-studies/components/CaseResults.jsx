import { CaseSection } from './CaseSection'
import { Reveal, Stagger, StaggerItem } from '@/components/animations'
import { Icon } from '@/components/ui'
import { fadeInUp } from '@/animations'

/**
 * Section 9 — Results.
 *
 * THE METRICS ROW IS EMPTY BY DEFAULT, AND THAT IS THE POINT
 * Every case study template on the internet has three big numbers at the top of
 * its results section, and most of those numbers were estimated. A figure on a
 * portfolio page is a claim you will be asked to defend in an interview — "how
 * did you measure that?" is the most reasonable follow-up question there is, and
 * "I didn't, really" is the worst possible answer.
 *
 * So `metrics` renders only what the data file actually holds. If nothing was
 * measured, the row does not appear and the qualitative outcomes carry the
 * section on their own, which they do perfectly well.
 *
 * LESSONS ARE GIVEN EQUAL WEIGHT TO IMPACT
 * Deliberately. The impact list is what the project achieved and reads as
 * marketing; the lessons list is what you would do differently and reads as
 * experience. Senior readers skip the first and stop at the second.
 */
export function CaseResults({ results }) {
  const metrics = results.metrics ?? []
  const performance = (results.performance ?? []).filter(Boolean)

  return (
    <CaseSection
      id="results"
      step="08"
      eyebrow="Results"
      icon="results"
      title="What changed"
    >
      {metrics.length > 0 && (
        <Stagger as="ul" className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <StaggerItem as="li" key={metric.label} variants={fadeInUp}>
              <div className="card card-glass h-full rounded-card text-center">
                <p className="heading-xs text-gradient">{metric.value}</p>
                <p className="mt-2 text-body-sm font-medium text-ink">{metric.label}</p>
                {metric.note && <p className="mt-1 text-body-sm text-faint">{metric.note}</p>}
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      )}

      <div className="grid gap-10 lg:grid-cols-3 lg:gap-12">
        <Reveal>
          <div className="border-t border-line pt-6">
            <p className="eyebrow flex items-center gap-2 text-accent">
              <Icon name="success" className="size-4" />
              Impact
            </p>
            <ul className="mt-5 flex flex-col gap-3">
              {results.impact.map((item) => (
                <li key={item} className="flex items-start gap-3 text-body-sm text-muted">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-accent-soft">
                    <Icon name="check" className="size-3 text-accent" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        {performance.length > 0 && (
          <Reveal delay={0.08}>
            <div className="border-t border-line pt-6">
              <p className="eyebrow flex items-center gap-2 text-faint">
                <Icon name="gauge" className="size-4" />
                Performance
              </p>
              <ul className="mt-5 flex flex-col gap-3">
                {performance.map((item) => (
                  <li key={item} className="text-body-sm text-muted">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        )}

        <Reveal delay={0.16}>
          <div className="border-t border-line pt-6">
            <p className="eyebrow flex items-center gap-2 text-faint">
              <Icon name="learning" className="size-4" />
              What I would do differently
            </p>
            <ul className="mt-5 flex flex-col gap-4">
              {results.lessons.map((lesson) => (
                <li key={lesson} className="text-body-sm text-muted">
                  {lesson}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </CaseSection>
  )
}
