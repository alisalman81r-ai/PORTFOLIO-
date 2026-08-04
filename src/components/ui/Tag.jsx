import { cn } from '@/utils'

/**
 * Small pill label — tech stack chips, categories, metadata.
 *
 * Renders a `<span>` by default. Pass `as="li"` inside a list so the markup
 * stays semantic: a row of tech names is a list, and screen readers announce
 * "list, 6 items" rather than a run-on line of words.
 *
 * Not interactive, and deliberately so. A tag that looks clickable but is not
 * is worse than a plain label — if it needs to filter something, it should be a
 * `<button>`, which is a different component.
 *
 * @param {object} props
 * @param {React.ElementType} [props.as='span']
 * @param {'default'|'accent'|'outline'} [props.tone='default']
 * @param {string} [props.className]
 * @param {React.ReactNode} props.children
 */
export function Tag({ as: Component = 'span', tone = 'default', className, children, ...rest }) {
  const TONES = {
    default: 'border-line bg-surface/60 text-muted',
    accent: 'border-accent/30 bg-accent-soft text-accent',
    outline: 'border-line-strong bg-transparent text-muted',
  }

  return (
    <Component
      className={cn(
        'inline-flex items-center gap-1.5 rounded-pill border px-3 py-1.5',
        'font-mono text-xs whitespace-nowrap',
        'transition-colors duration-fast',
        TONES[tone] ?? TONES.default,
        className,
      )}
      {...rest}
    >
      {children}
    </Component>
  )
}
