/**
 * UI primitives — the design system's React surface.
 *
 * Small, presentational, reusable, context-free. A component here should be
 * describable without naming a page, and must never read from `@/data` — that
 * makes it a section, not a primitive.
 *
 * CONVENTIONS
 *   - One component per file, named export, filename matches the component.
 *   - Accept and merge `className` last via `cn()` so callers can always
 *     override; spread `...rest` so ARIA and data attributes pass through.
 *   - Style with `btn` / `card` / `glass` from `styles/components.css` rather
 *     than re-implementing them in JSX.
 *   - Decorative elements are always `aria-hidden`.
 *
 *   import { MagneticButton, TiltCard } from '@/components/ui'
 */

/* Identity */
export { Logo } from './Logo'

/* Interaction */
export { MagneticButton } from './MagneticButton'
export { TiltCard } from './TiltCard'
export { HamburgerButton } from './HamburgerButton'

/* Typography effects */
export { RotatingText } from './RotatingText'

/* Atmosphere — decorative, non-interactive */
export { GlowOrb } from './GlowOrb'
export { NoiseOverlay } from './NoiseOverlay'
