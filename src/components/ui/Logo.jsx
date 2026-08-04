import { cn } from '@/utils'

/**
 * Wordmark.
 *
 * A text logo, per the brief — but built as a component so replacing it with an
 * SVG mark later touches one file rather than the header, the footer, and the
 * mobile menu.
 *
 * The trailing dot is the whole idea: a full stop after a name reads as a
 * statement rather than a label. It carries the accent colour, which makes the
 * logo the one place the brand hue appears at rest.
 *
 * Rendered as a link to the top of the page, matching the convention every
 * visitor already expects from a site logo.
 *
 * @param {object} props
 * @param {string} props.label Wordmark text.
 * @param {string} [props.href='#home']
 * @param {string} [props.className]
 */
export function Logo({ label, href = '#home', className, ...rest }) {
  return (
    <a
      href={href}
      // The accessible name says where the link goes; the visible text is a
      // brand mark, not an instruction.
      aria-label={`${label} — back to top`}
      className={cn(
        'group inline-flex items-baseline gap-px font-display text-lg font-medium',
        'tracking-tight text-ink transition-opacity duration-fast hover:opacity-80',
        className,
      )}
      {...rest}
    >
      <span>{label}</span>
      <span
        aria-hidden="true"
        className="text-accent transition-transform duration-base ease-out-expo group-hover:translate-y-[-0.15em]"
      >
        .
      </span>
    </a>
  )
}
