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

/* Content primitives */
export { Icon } from './Icon'
export { Tag } from './Tag'
export { ImageFrame } from './ImageFrame'
export { GlowBorder } from './GlowBorder'

/* Interaction */
export { MagneticButton } from './MagneticButton'
export { TiltCard } from './TiltCard'
export { HamburgerButton } from './HamburgerButton'

/* Typography effects */
export { RotatingText } from './RotatingText'

/* Atmosphere — decorative, non-interactive */
export { GlowOrb } from './GlowOrb'
export { NoiseOverlay } from './NoiseOverlay'

/**
 * DELIBERATELY NOT EXPORTED: `TechIcon`.
 *
 * It pulls in ~37 kB of Simple Icons brand marks. Re-exporting it here put that
 * weight into this barrel's module graph — and because eagerly-rendered
 * components (Header, About) import from this barrel, the bundler hoisted the
 * brand marks into a shared chunk that loads on first paint, defeating the code
 * split on the Skills section entirely.
 *
 * Import it by its own path instead:
 *
 *   import { TechIcon } from '@/components/ui/TechIcon'
 *
 * The general lesson: a barrel is a dependency edge. Anything heavy and
 * narrowly used stays off it, or every consumer of the barrel pays for it.
 */
