import { CaseSection } from './CaseSection'
import { Reveal, Stagger, StaggerItem } from '@/components/animations'
import { Icon } from '@/components/ui'
import { fadeInUp } from '@/animations'

/**
 * Section 6 — Development.
 *
 * Six layers, and the interesting thing about this component is what it does
 * with the ones that do not apply.
 *
 * A marketing site has no database. A storyboard has no API. The usual
 * treatment is to write "N/A" or invent something vague, and both make the page
 * worse — the first is filler and the second is a claim you would have to
 * defend. Here, a layer set to `null` in the data is not rendered at all, and
 * if the whole section is `null` the section itself disappears from the page
 * and from the section index.
 *
 * That silence carries meaning. A case study with no Backend entry reads as a
 * frontend project, which is accurate. One with a Backend entry full of
 * placeholder text reads as carelessness.
 */
const LAYERS = [
  { key: 'architecture', label: 'Architecture', icon: 'layers' },
  { key: 'frontend', label: 'Frontend', icon: 'frontend' },
  { key: 'backend', label: 'Backend', icon: 'server' },
  { key: 'database', label: 'Database', icon: 'database' },
  { key: 'api', label: 'API', icon: 'handoff' },
  { key: 'deployment', label: 'Deployment', icon: 'deploy' },
]

export function CaseDevelopment({ development }) {
  // The whole section is optional — see the note above.
  if (!development) return null

  const layers = LAYERS.filter((layer) => development[layer.key])
  if (!layers.length && !development.decisions?.length) return null

  return (
    <CaseSection
      id="development"
      step="05"
      eyebrow="Development"
      icon="build"
      title="How it was built"
      lead="Only the layers this project actually has. An empty heading would be filler, and a vague one would be a claim."
    >
      <Stagger as="dl" className="grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {layers.map((layer) => (
          <StaggerItem
            as="div"
            key={layer.key}
            variants={fadeInUp}
            // The single-pixel grid gap over a line-coloured background draws
            // every divider without a border on each cell — which would double
            // up wherever two cells meet.
            className="bg-canvas p-6 lg:p-7"
          >
            {/* dt/dd, not two paragraphs. This is a term and its definition, and
                marking it as one is what makes a screen reader announce the
                pairing — axe flagged the first version because a <dl> whose
                children are <p> elements is a list containing no list items. */}
            <dt className="eyebrow flex items-center gap-2 text-faint">
              <Icon name={layer.icon} className="size-4 text-accent" />
              {layer.label}
            </dt>
            <dd className="mt-3 text-body-sm text-muted">{development[layer.key]}</dd>
          </StaggerItem>
        ))}
      </Stagger>

      {development.decisions?.length > 0 && (
        <Reveal delay={0.1}>
          <div className="mt-10 border-t border-line pt-8">
            <p className="eyebrow flex text-faint">Decisions worth defending</p>
            <ul className="mt-5 flex flex-col gap-3">
              {development.decisions.map((decision) => (
                <li key={decision} className="flex items-start gap-3 text-body-sm text-muted">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-accent-soft">
                    <Icon name="check" className="size-3 text-accent" />
                  </span>
                  {decision}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      )}
    </CaseSection>
  )
}
