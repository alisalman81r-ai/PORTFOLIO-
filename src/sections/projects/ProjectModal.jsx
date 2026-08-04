import { Icon, ImageFrame, Modal, Tag } from '@/components/ui'
import { TechIcon } from '@/components/ui/TechIcon'
import { PROJECT_STATUS } from '@/data'
import { cn } from '@/utils'

/**
 * Section heading inside the case study.
 *
 * A local component rather than five near-identical heading blocks — the icon,
 * spacing, and h4 level are the same every time, and only the label changes.
 */
function CaseSection({ icon, title, children, className }) {
  return (
    <section className={cn('border-t border-line pt-8', className)}>
      <h4 className="flex items-center gap-2.5 font-display text-base font-medium text-ink">
        <span className="grid size-8 place-items-center rounded-input border border-line bg-surface">
          <Icon name={icon} className="size-4 text-accent" />
        </span>
        {title}
      </h4>

      <div className="mt-5">{children}</div>
    </section>
  )
}

/**
 * Full case study for one project.
 *
 * Everything modal — focus trap, Escape, scroll lock, portal, backdrop
 * dismissal, focus restoration — is handled by `<Modal>`. This component is
 * only responsible for the content, which is the right split: the dialog
 * mechanics are identical for every future modal on the site.
 *
 * Blocks render conditionally on their data being present, so a project with no
 * recorded process or results simply shows fewer sections rather than empty
 * headings. That is what lets the placeholder records coexist with finished
 * case studies.
 *
 * @param {object} props
 * @param {import('@/data/projects').Project|null} props.project Null when closed.
 * @param {() => void} props.onClose
 */
export function ProjectModal({ project, onClose }) {
  // `open` is derived from the project rather than a separate boolean — two
  // sources of truth for one state is how a modal ends up open with no content.
  const open = Boolean(project)
  const headingId = project ? `project-modal-${project.id}-title` : undefined
  const status = project ? (PROJECT_STATUS[project.status] ?? PROJECT_STATUS.concept) : null

  return (
    <Modal open={open} onClose={onClose} labelledBy={headingId}>
      {project && (
        <article className="p-6 sm:p-8 lg:p-10">
          {/* ── Header ─────────────────────────────────────────────────── */}
          <header className="pr-12">
            <div className="flex flex-wrap items-center gap-2">
              <Tag tone={status.tone}>{status.label}</Tag>
              <Tag tone="outline">{project.year}</Tag>
              <Tag tone="outline">{project.category}</Tag>
            </div>

            <h3 id={headingId} className="heading-sm mt-5 text-ink">
              {project.title}
            </h3>

            <p className="lead mt-4 max-w-prose">{project.longDescription}</p>
          </header>

          {/* ── Gallery ────────────────────────────────────────────────── */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {/* Falls back to two placeholder frames so the layout is legible
                before any real screenshots exist. */}
            {(project.gallery.length > 0 ? project.gallery : [null, null]).map((image, index) => (
              <ImageFrame
                key={index}
                src={image}
                alt={image ? `${project.title} — screen ${index + 1}` : ''}
                ratio="video"
                loading="lazy"
                placeholderLabel="Add gallery images"
                placeholderHint="project.gallery"
                className="rounded-card border border-line"
              />
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-8">
            {/* ── Problem / Solution ───────────────────────────────────── */}
            <CaseSection icon="problem" title="The problem" className="border-t-0 pt-0">
              <p className="max-w-prose text-body-sm text-muted">{project.problem}</p>
            </CaseSection>

            <CaseSection icon="solution" title="The solution">
              <p className="max-w-prose text-body-sm text-muted">{project.solution}</p>
            </CaseSection>

            {/* ── Features ─────────────────────────────────────────────── */}
            {project.features.length > 0 && (
              <CaseSection icon="target" title="Features">
                <ul className="grid gap-4 sm:grid-cols-2">
                  {project.features.map((feature) => (
                    <li key={feature.title} className="card rounded-card">
                      <h5 className="text-body-sm font-medium text-ink">{feature.title}</h5>
                      <p className="mt-1.5 text-body-sm text-muted">{feature.description}</p>
                    </li>
                  ))}
                </ul>
              </CaseSection>
            )}

            {/* ── Tech stack ───────────────────────────────────────────── */}
            <CaseSection icon="code" title="Tech stack">
              <ul className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <Tag as="li" key={tech}>
                    {tech}
                  </Tag>
                ))}
              </ul>
            </CaseSection>

            {/* ── Process ──────────────────────────────────────────────── */}
            {project.process.length > 0 && (
              <CaseSection icon="process" title="Development process">
                <ol className="grid gap-4 sm:grid-cols-2">
                  {project.process.map((step) => (
                    <li key={step.step} className="flex gap-4">
                      <span aria-hidden="true" className="font-mono text-xs text-accent">
                        {step.step}
                      </span>
                      <div>
                        <h5 className="text-body-sm font-medium text-ink">{step.title}</h5>
                        <p className="mt-1 text-body-sm text-muted">{step.description}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </CaseSection>
            )}

            {/* ── Challenges ───────────────────────────────────────────── */}
            {project.challenges.length > 0 && (
              <CaseSection icon="milestone" title="Challenges & solutions">
                <ul className="flex flex-col gap-4">
                  {project.challenges.map((entry) => (
                    <li key={entry.challenge} className="card rounded-card">
                      <p className="text-body-sm text-ink">{entry.challenge}</p>
                      <p className="mt-3 flex gap-2.5 text-body-sm text-muted">
                        <Icon name="arrow" className="mt-1 size-3.5 shrink-0 text-accent" />
                        {entry.solution}
                      </p>
                    </li>
                  ))}
                </ul>
              </CaseSection>
            )}

            {/* ── Results ──────────────────────────────────────────────── */}
            {project.results.length > 0 && (
              <CaseSection icon="results" title="Results">
                <ul className="flex flex-col gap-2.5">
                  {project.results.map((result) => (
                    <li key={result} className="flex items-start gap-3">
                      <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-accent-soft">
                        <Icon name="check" className="size-3 text-accent" />
                      </span>
                      <span className="text-body-sm text-muted">{result}</span>
                    </li>
                  ))}
                </ul>
              </CaseSection>
            )}
          </div>

          {/* ── Footer actions ─────────────────────────────────────────── */}
          <footer className="mt-10 flex flex-wrap items-center gap-3 border-t border-line pt-8">
            {project.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="btn btn-primary btn-sm"
              >
                <Icon name="external" className="size-4" />
                Visit live site
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            ) : (
              <button type="button" disabled className="btn btn-primary btn-sm">
                <Icon name="external" className="size-4" />
                Live link coming soon
              </button>
            )}

            {project.githubUrl ? (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="btn btn-outline btn-sm"
              >
                <TechIcon name="github" className="size-4" />
                View source
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            ) : (
              <button type="button" disabled className="btn btn-outline btn-sm">
                <TechIcon name="github" className="size-4" />
                Source not public
              </button>
            )}
          </footer>
        </article>
      )}
    </Modal>
  )
}
