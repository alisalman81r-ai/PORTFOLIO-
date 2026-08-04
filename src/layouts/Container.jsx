import { cn } from '@/utils'

/**
 * Width map. Each entry is a utility from `styles/utilities.css`, which reads
 * its max-width from the `--container-*` tokens — so page width is defined in
 * exactly one place and this component never hardcodes a number.
 */
const SIZES = {
  /** Standard content width (90rem). The default for almost everything. */
  page: 'container-page',
  /** Wider (110rem) — showcase rows, galleries, near-full-bleed media. */
  wide: 'container-wide',
  /** Reading measure (~70ch) — long-form copy, case-study body text. */
  prose: 'container-prose',
  /** Full width, gutters only. For elements that manage their own max-width. */
  fluid: 'w-full px-gutter',
  /** Edge to edge, no gutter. For full-bleed media inside a contained page. */
  bleed: 'w-full',
}

/**
 * Horizontal layout primitive: centres content, caps its width, applies the
 * responsive page gutter.
 *
 * Exists so that page width is a *decision made once* rather than a
 * `max-w-7xl mx-auto px-6` incantation copy-pasted into fifty components —
 * where changing the site's measure means fifty edits and one you'll miss.
 *
 * @param {object} props
 * @param {React.ElementType} [props.as='div'] Element or component to render.
 *   Use a semantic tag where one applies rather than nesting an extra div.
 * @param {keyof typeof SIZES} [props.size='page'] Width preset.
 * @param {string} [props.className] Merged last, so it always wins.
 * @param {React.ReactNode} props.children
 *
 * @example
 * <Container as="header" size="wide" className="flex items-center">
 *   …
 * </Container>
 */
export function Container({ as: Component = 'div', size = 'page', className, children, ...rest }) {
  return (
    <Component className={cn(SIZES[size] ?? SIZES.page, className)} {...rest}>
      {children}
    </Component>
  )
}
