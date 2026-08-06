import { Section } from '@/layouts'
import { Reveal } from '@/components/animations'
import { Icon } from '@/components/ui'
import { cn } from '@/utils'

/**
 * The shell every case-study section composes.
 *
 * WHY A SHELL RATHER THAN TWELVE SEPARATE LAYOUTS
 * A case study is read in one pass, top to bottom. If each section invents its
 * own heading size, spacing and rhythm, the page reads as twelve documents
 * stapled together — which is exactly how most portfolio case studies read. One
 * shell means the eye learns the pattern once: numbered eyebrow, heading,
 * optional lead, content. Everything after that is just content shape.
 *
 * The number is not decoration. A long page with no sense of position is one a
 * reader abandons in the middle, and "04" tells them where they are without a
 * progress bar or a sticky index competing for attention.
 *
 * HEADINGS
 * `title` renders as an `<h2>` and the section is labelled by it, so the page
 * outline is a flat list of twelve sections under the one `<h1>` in the hero.
 * Anything nested inside uses `<h3>`, which keeps the outline continuous for a
 * screen reader stepping through by heading.
 *
 * @param {object} props
 * @param {string} props.id            Anchor target; also the aria-labelledby base.
 * @param {string} [props.step]        Two-digit position, e.g. '04'.
 * @param {string} props.eyebrow       Short label above the heading.
 * @param {string} props.title
 * @param {string} [props.lead]        One paragraph under the heading.
 * @param {string} [props.icon]        Registry key, shown beside the eyebrow.
 * @param {'sm'|'base'|'lg'|'none'} [props.spacing]
 * @param {string} [props.className]
 * @param {React.ReactNode} props.children
 */
export function CaseSection({
  id,
  step,
  eyebrow,
  title,
  lead,
  icon,
  spacing = 'base',
  className,
  children,
}) {
  const headingId = `${id}-title`

  return (
    <Section
      id={id}
      labelledBy={headingId}
      spacing={spacing}
      className={cn('case-section', className)}
    >
      <Reveal>
        <div className="flex items-center gap-3">
          {icon && (
            <span className="grid size-8 shrink-0 place-items-center rounded-input border border-line bg-surface">
              <Icon name={icon} className="size-4 text-accent" />
            </span>
          )}
          <p className="eyebrow flex items-center gap-2 text-faint">
            {step && (
              // `aria-hidden` because "04" read aloud before every heading is
              // noise — the position is a visual aid, not information.
              <span aria-hidden="true" className="text-accent">
                {step}
              </span>
            )}
            {eyebrow}
          </p>
        </div>

        <h2 id={headingId} className="heading-sm mt-4 max-w-3xl text-ink">
          {title}
        </h2>

        {lead && <p className="lead mt-5 max-w-prose">{lead}</p>}
      </Reveal>

      <div className="mt-10 lg:mt-12">{children}</div>
    </Section>
  )
}

/**
 * A labelled block of prose — the shape most of this page is made of.
 *
 * Rendered as a description list rather than a heading and a paragraph, because
 * that is what it is: a term and its definition. A screen reader announces the
 * pairing, and the visual treatment stays identical.
 *
 * @param {object} props
 * @param {string} props.label
 * @param {React.ReactNode} props.children
 * @param {string} [props.className]
 */
export function CaseBlock({ label, children, className }) {
  return (
    <div className={cn('border-t border-line pt-5', className)}>
      <dt className="eyebrow flex text-faint">{label}</dt>
      <dd className="mt-3 text-body-sm text-muted">{children}</dd>
    </div>
  )
}
