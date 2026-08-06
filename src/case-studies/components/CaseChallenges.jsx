import { CaseSection } from './CaseSection'
import { Reveal } from '@/components/animations'
import { Icon, Tag } from '@/components/ui'

/**
 * Section 8 — Challenges.
 *
 * Grouped by kind — technical, design, performance — because a flat list of
 * problems reads as a complaint, and grouped it reads as coverage: this project
 * hit resistance in three different disciplines and each was resolved.
 *
 * EVERY CHALLENGE IS PAIRED WITH ITS RESOLUTION, AND THE MARKUP ENFORCES IT
 * The data model has no way to express a challenge without a solution. That is
 * the single most persuasive thing on a case study page — anyone can list what
 * was hard; what a client is buying is the evidence that hard things got
 * resolved — and it is also the easiest thing to accidentally omit when writing
 * at speed.
 *
 * A group with no items is dropped rather than rendered empty. A project that
 * hit no performance problems should not have a performance heading.
 */
const KINDS = {
  technical: { label: 'Technical', icon: 'build' },
  design: { label: 'Design', icon: 'palette' },
  performance: { label: 'Performance', icon: 'gauge' },
}

export function CaseChallenges({ challenges }) {
  const groups = (challenges ?? []).filter((group) => group.items?.length)
  if (!groups.length) return null

  return (
    <CaseSection
      id="challenges"
      step="07"
      eyebrow="Challenges"
      icon="puzzle"
      title="What resisted, and how it was resolved"
      lead="Paired deliberately. A challenge without its resolution is a complaint, and the pairing is the part worth reading."
    >
      <div className="flex flex-col gap-10">
        {groups.map((group, groupIndex) => {
          const kind = KINDS[group.kind] ?? KINDS.technical

          return (
            <Reveal key={group.kind} delay={groupIndex * 0.06}>
              <div className="border-t border-line pt-6">
                <div className="flex items-center gap-3">
                  <span className="grid size-8 shrink-0 place-items-center rounded-input border border-line bg-surface">
                    <Icon name={kind.icon} className="size-4 text-accent" />
                  </span>
                  {/* h3: the section heading is h2. */}
                  <h3 className="text-body-sm font-medium text-ink">{kind.label}</h3>
                  <Tag tone="outline" className="ml-auto">
                    {group.items.length === 1 ? '1 issue' : group.items.length + ' issues'}
                  </Tag>
                </div>

                <ul className="mt-6 grid gap-4 lg:grid-cols-2">
                  {group.items.map((item) => (
                    <li key={item.challenge} className="card card-glass rounded-card">
                      <p className="eyebrow flex text-faint">Challenge</p>
                      <p className="mt-2 text-body-sm text-ink">{item.challenge}</p>

                      <p className="eyebrow mt-5 flex items-center gap-2 text-accent">
                        <Icon name="solution" className="size-3.5" />
                        Resolution
                      </p>
                      <p className="mt-2 text-body-sm text-muted">{item.solution}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          )
        })}
      </div>
    </CaseSection>
  )
}
