import { Reveal, TextReveal } from '@/components/animations'
import { fadeInUp } from '@/animations'
import { cn } from '@/utils'

/**
 * Badge + headline + intro — the opening of every section.
 *
 * WHY THIS EXISTS
 * The same fifteen lines had been written by hand in About, Skills, and
 * Projects: an eyebrow pill, an `<h2>` of masked `TextReveal` lines with the
 * accent word carrying a gradient, and a lead paragraph on a delay. Four more
 * sections would have meant seven copies of a block whose *animation timing* is
 * a design decision — exactly the kind of thing that silently drifts apart.
 *
 * The gradient-on-the-word detail is the clearest example: it has to go on the
 * same element as the transform, and getting that wrong renders the word
 * invisible. That knowledge belongs in one place, not seven.
 *
 * @param {object} props
 * @param {string} props.badge Eyebrow label.
 * @param {{text: string, accent?: boolean}[]} props.headline Explicit lines, so
 *   the break points stay a content decision rather than a function of width.
 *   `accent` marks the one line rendered in italic serif with a gradient fill.
 * @param {string} [props.intro] Lead paragraph.
 * @param {string} props.id Applied to the `<h2>`; pass the section's
 *   `labelledBy` target so the landmark is named.
 * @param {'left'|'center'} [props.align='left']
 * @param {string} [props.className]
 */
export function SectionHeader({ badge, headline, intro, id, align = 'left', className }) {
  const isCentred = align === 'center'

  return (
    <div className={cn('max-w-3xl', isCentred && 'mx-auto text-center', className)}>
      <Reveal variants={fadeInUp}>
        <p
          className={cn(
            // `flex w-fit` overrides `eyebrow`'s inline-flex so the pill is a
            // block-level element that shrink-wraps rather than sharing a line.
            'eyebrow glass flex w-fit rounded-pill px-3 py-2',
            isCentred && 'mx-auto',
          )}
        >
          {badge}
        </p>
      </Reveal>

      <h2 id={id} className="heading-md mt-6 text-ink">
        {headline.map((line, index) => (
          <span key={line.text} className="block">
            <TextReveal
              text={line.text}
              // Below the fold: mount-triggered text would finish revealing long
              // before the reader arrives, so they would only see the end state.
              inView
              delay={index * 0.1}
              className={cn(line.accent && 'accent-serif')}
              // The gradient goes on the word, not the wrapper. Each word is
              // transformed for the reveal, and a transform on a descendant of a
              // `background-clip: text` element promotes it to its own layer —
              // the clipped background does not follow, and the text renders
              // invisible.
              wordClassName={cn(line.accent && 'text-gradient pr-[0.08em]')}
            />
          </span>
        ))}
      </h2>

      {intro && (
        <Reveal variants={fadeInUp} delay={0.1}>
          <p className={cn('lead mt-6', isCentred && 'mx-auto')}>{intro}</p>
        </Reveal>
      )}
    </div>
  )
}
