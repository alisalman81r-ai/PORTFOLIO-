import { Container } from './Container'
import { cn } from '@/utils'

/**
 * Vertical rhythm presets, from `styles/utilities.css`.
 * Fluid via clamp(), so spacing stays proportional from phone to ultrawide.
 */
const SPACING = {
  /** Default gap between major page sections. */
  base: 'section-y',
  /** Tighter — for a section that continues the previous one's thought. */
  sm: 'section-y-sm',
  /** Top only — when the previous element already supplies bottom space. */
  top: 'section-t',
  /** Bottom only. */
  bottom: 'section-b',
  /** No padding — the section manages its own (e.g. a pinned full-height block). */
  none: '',
}

/**
 * Vertical layout primitive: one page section with consistent rhythm, a scroll
 * anchor, and an accessible landmark.
 *
 * Consistent spacing is most of what separates a designed page from an
 * assembled one, and it is the first thing to drift when every section picks
 * its own `py-*`. This makes the correct choice the easy one.
 *
 * ACCESSIBILITY: a bare `<section>` is only exposed as a landmark to screen
 * readers when it has an accessible name. Pass `labelledBy` pointing at the
 * id of the section's heading — then it appears in the landmark list and users
 * can jump straight to it. Without a name it is announced as a generic group,
 * which is worse than a `<div>`.
 *
 * @param {object} props
 * @param {React.ElementType} [props.as='section'] Override for `<footer>`,
 *   `<article>`, etc.
 * @param {string} [props.id] Scroll-anchor target. Matches nav hrefs and the
 *   `scroll-margin` offset set in `styles/base.css`.
 * @param {keyof typeof SPACING} [props.spacing='base'] Vertical rhythm preset.
 * @param {'page'|'wide'|'prose'|'fluid'|'bleed'|false} [props.container='page']
 *   Container width, or `false` to render children unwrapped — needed when a
 *   child must run full-bleed.
 * @param {string} [props.labelledBy] Id of the heading that names this section.
 * @param {string} [props.className] Applied to the section element.
 * @param {string} [props.containerClassName] Applied to the inner container.
 * @param {React.ReactNode} props.children
 *
 * @example
 * <Section id="work" labelledBy="work-title">
 *   <h2 id="work-title" className="heading-lg">Selected Work</h2>
 * </Section>
 *
 * @example
 * // Full-bleed media: opt out of the container, then re-wrap only the copy.
 * <Section id="reel" container={false} spacing="none">
 *   <video … />
 * </Section>
 */
export function Section({
  as: Component = 'section',
  id,
  spacing = 'base',
  container = 'page',
  labelledBy,
  className,
  containerClassName,
  children,
  ...rest
}) {
  const content = container ? (
    <Container size={container} className={containerClassName}>
      {children}
    </Container>
  ) : (
    children
  )

  return (
    <Component
      id={id}
      aria-labelledby={labelledBy}
      className={cn('relative', SPACING[spacing] ?? SPACING.base, className)}
      {...rest}
    >
      {content}
    </Component>
  )
}
