import { CaseSection } from './CaseSection'
import { Reveal, Stagger, StaggerItem } from '@/components/animations'
import { Icon } from '@/components/ui'
import { scaleIn } from '@/animations'

/**
 * Section 3 — The problem.
 *
 * Three questions answered in order: what was wrong, who it happened to, and why
 * it was worth money to fix. Most portfolio case studies answer the first and
 * skip the other two, which is why they read as project summaries rather than as
 * evidence that someone understood a business.
 *
 * `who` is the one that exposes weak thinking. "Users" is not an audience, it is
 * a way of avoiding naming one — so it gets its own card rather than a clause,
 * and a vague answer has nowhere to hide.
 */
const FACETS = [
  { key: 'what', label: 'What was wrong', icon: 'problem' },
  { key: 'who', label: 'Who it affected', icon: 'user' },
  { key: 'why', label: 'Why it mattered', icon: 'zap' },
]

export function CaseProblem({ problem }) {
  return (
    <CaseSection
      id="problem"
      step="02"
      eyebrow="The problem"
      icon="problem"
      title="What was actually broken"
    >
      <Stagger as="ul" className="grid gap-4 md:grid-cols-3">
        {FACETS.map((facet) => (
          <StaggerItem as="li" key={facet.key} variants={scaleIn} className="h-full">
            <div className="card card-glass flex h-full flex-col rounded-card">
              <span className="grid size-10 place-items-center rounded-input border border-line bg-surface">
                <Icon name={facet.icon} className="size-4 text-accent" />
              </span>
              {/* h3: the section heading is h2, so the outline stays continuous. */}
              <h3 className="mt-5 text-body-sm font-medium text-ink">{facet.label}</h3>
              <p className="mt-2 text-body-sm text-muted">{problem[facet.key]}</p>
            </div>
          </StaggerItem>
        ))}
      </Stagger>

      {problem.evidence?.length > 0 && (
        <Reveal delay={0.1}>
          <div className="mt-10 border-t border-line pt-8">
            <p className="eyebrow flex text-faint">What told us it was real</p>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {problem.evidence.map((item) => (
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
      )}
    </CaseSection>
  )
}
