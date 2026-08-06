import { CaseSection } from './CaseSection'
import { Reveal, Stagger, StaggerItem } from '@/components/animations'
import { Icon } from '@/components/ui'
import { fadeInUp, scaleIn } from '@/animations'

/**
 * Section 4 — The solution.
 *
 * Split three ways because they are three different claims, and collapsing them
 * into one paragraph is how a case study loses the ability to prove anything:
 *
 *   approach        what was built
 *   designThinking  why it looks and behaves the way it does
 *   strategy        why it was built in that order
 *
 * The third is the one clients and senior engineers actually read. Anyone can
 * describe what they made; sequencing decisions is where judgement shows.
 */
const ASPECTS = [
  { key: 'approach', label: 'How it works' },
  { key: 'designThinking', label: 'Design thinking' },
  { key: 'strategy', label: 'Development strategy' },
]

export function CaseSolution({ solution }) {
  return (
    <CaseSection
      id="solution"
      step="03"
      eyebrow="The solution"
      icon="solution"
      title="What was built, and why that way"
    >
      {/*
        A `<dl>` may contain `<dt>`/`<dd>` directly, or wrapped in a single
        `<div>` — and nothing else. The first version of this nested them two
        deep, inside a `<Reveal>` inside a `<CaseBlock>`, which axe flagged on
        every item: "description list item does not have a <dl> parent element".

        So the stagger element *is* the wrapper div. `Stagger`/`StaggerItem`
        take an `as` prop, which means the animation costs no extra node here —
        the choreography and the semantics land on the same element.
      */}
      <Stagger as="dl" className="grid gap-8 lg:grid-cols-3 lg:gap-10">
        {ASPECTS.map((aspect) => (
          <StaggerItem as="div" key={aspect.key} variants={fadeInUp} className="border-t border-line pt-5">
            <dt className="eyebrow flex text-faint">{aspect.label}</dt>
            <dd className="mt-3 text-body-sm text-muted">{solution[aspect.key]}</dd>
          </StaggerItem>
        ))}
      </Stagger>

      {solution.principles?.length > 0 && (
        <div className="mt-14">
          <Reveal>
            <p className="eyebrow flex text-faint">Principles the build held to</p>
          </Reveal>

          <Stagger as="ul" className="mt-6 grid gap-4 md:grid-cols-3">
            {solution.principles.map((principle) => (
              <StaggerItem as="li" key={principle.title} variants={scaleIn} className="h-full">
                <div className="card card-glass group flex h-full flex-col rounded-card transition-[border-color,box-shadow] duration-base ease-out-quart hover:border-accent/30 hover:shadow-glow">
                  <span className="grid size-10 place-items-center rounded-input border border-line bg-surface transition-colors duration-base group-hover:border-accent/40 group-hover:bg-accent-soft">
                    <Icon name={principle.icon ?? 'target'} className="size-4 text-accent" />
                  </span>
                  <h3 className="mt-5 text-body-sm font-medium text-ink">{principle.title}</h3>
                  <p className="mt-2 text-body-sm text-muted">{principle.description}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      )}
    </CaseSection>
  )
}
