import { CaseBlock, CaseSection } from './CaseSection'
import { Reveal, Stagger, StaggerItem } from '@/components/animations'
import { Icon } from '@/components/ui'
import { fadeInUp } from '@/animations'

/**
 * Section 2 — Overview.
 *
 * Three things a reader needs before any detail will mean anything: the short
 * version, the long version, and what the work was actually supposed to achieve.
 *
 * The business goal is given its own card rather than buried in the prose. It is
 * the sentence that separates a case study from a description — it says the
 * project had a purpose someone was paying for, and every decision after it can
 * be judged against it.
 */
export function CaseOverview({ overview }) {
  const paragraphs = overview.detail.split('\n\n').filter(Boolean)

  return (
    <CaseSection
      id="overview"
      step="01"
      eyebrow="Overview"
      icon="overview"
      title="What this project is"
      lead={overview.summary}
    >
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
        <Stagger as="div" className="lg:col-span-7">
          {paragraphs.map((paragraph) => (
            <StaggerItem
              as="p"
              key={paragraph.slice(0, 40)}
              variants={fadeInUp}
              className="text-body text-muted not-first:mt-5"
            >
              {paragraph}
            </StaggerItem>
          ))}
        </Stagger>

        <div className="lg:col-span-5">
          <Reveal>
            <div className="card card-glass rounded-card">
              <p className="eyebrow flex items-center gap-2 text-accent">
                <Icon name="target" className="size-4" />
                Business goal
              </p>
              <p className="mt-4 text-body-sm text-ink">{overview.businessGoal}</p>
            </div>
          </Reveal>

          {overview.facts?.length > 0 && (
            <Reveal delay={0.1}>
              <dl className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
                {overview.facts.map((fact) => (
                  <CaseBlock key={fact.label} label={fact.label}>
                    {fact.value}
                  </CaseBlock>
                ))}
              </dl>
            </Reveal>
          )}
        </div>
      </div>
    </CaseSection>
  )
}
