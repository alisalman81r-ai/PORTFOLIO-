import { CaseSection } from './CaseSection'
import { Stagger, StaggerItem } from '@/components/animations'
import { Icon } from '@/components/ui'
import { fadeInUp } from '@/animations'

/**
 * Section 12 — Future improvements.
 *
 * The most undervalued section on a case study page. A list of what is missing
 * reads as confidence rather than apology: it says the scope was a decision, not
 * a limit, and that you can tell the difference between what a project needs now
 * and what it could have.
 *
 * It is also the section that most often starts a conversation. A client reading
 * "saved views, so a user returns to the question they were asking" has just
 * been shown the next piece of work without being sold it.
 */
export function CaseFuture({ future }) {
  if (!future?.length) return null

  return (
    <CaseSection
      id="future"
      step="11"
      eyebrow="Future improvements"
      icon="sprout"
      title="What comes next"
      lead="Deliberately out of scope rather than overlooked — each of these was considered and deferred."
      spacing="base"
    >
      <Stagger as="ol" className="grid gap-4 sm:grid-cols-2">
        {future.map((item, index) => (
          <StaggerItem as="li" key={item} variants={fadeInUp}>
            <div className="card card-glass group flex h-full items-start gap-4 rounded-card transition-[border-color] duration-base ease-out-quart hover:border-accent/30">
              <span
                aria-hidden="true"
                className="font-mono text-xs tracking-wider-caps text-faint uppercase transition-colors duration-base group-hover:text-accent"
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <p className="text-body-sm text-muted">{item}</p>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </CaseSection>
  )
}

/**
 * A banner for a case study whose content is still placeholder.
 *
 * Shown rather than hidden. A draft page that looks finished is how a
 * placeholder ends up in front of a client — and the failure mode of hiding it
 * instead is worse, because then nobody remembers it exists.
 *
 * `role="note"` rather than `alert`: it is context, not an interruption, and an
 * alert would steal focus from a reader who is simply browsing.
 */
export function DraftBanner({ title }) {
  return (
    <div role="note" className="container-page">
      <div className="flex items-start gap-4 rounded-card border border-accent/30 bg-accent-soft px-5 py-4">
        <Icon name="error" className="mt-0.5 size-5 shrink-0 text-accent" />
        <div>
          <p className="text-body-sm font-medium text-ink">
            This case study is unfinished
          </p>
          <p className="mt-1 text-body-sm text-muted">
            {title} has no written record anywhere in this project, so every field below is a
            prompt rather than content. Fill it in — or delete the project and this page
            together — before sending anyone here.
          </p>
        </div>
      </div>
    </div>
  )
}
