/**
 * UI primitives — the design system's React surface.
 *
 * Empty by design. Components land here as real sections demand them, so each
 * one is shaped by an actual use case rather than guessed at up front. Building
 * a speculative `<Button>` with nine variants before a single page exists is
 * how design systems end up with API surface nobody uses.
 *
 * WHAT BELONGS HERE
 *   Small, presentational, reusable, context-free. It should be describable
 *   without naming a page: Button, Tag, Badge, Avatar, Marquee, Cursor,
 *   ThemeToggle, Magnetic, Logo, Divider.
 *
 * WHAT DOES NOT
 *   Anything that knows where it sits, or reads from `@/data` — that is a
 *   section (`@/sections`), not a UI primitive.
 *
 * CONVENTIONS
 *   - One component per file, named export, filename matches the component.
 *   - Accept and merge `className` last via `cn()` so callers can always
 *     override; spread `...rest` so ARIA and data attributes pass through.
 *   - Style with the `btn` / `card` classes from `styles/components.css`
 *     rather than re-implementing them in JSX.
 *   - Forward refs on anything that could be an animation target.
 *   - Add the export below when you create one.
 *
 * @example
 * // Typical shape:
 * export function Tag({ className, children, ...rest }) {
 *   return (
 *     <span className={cn('eyebrow rounded-pill border border-line px-3 py-1.5', className)} {...rest}>
 *       {children}
 *     </span>
 *   )
 * }
 */

export {}
