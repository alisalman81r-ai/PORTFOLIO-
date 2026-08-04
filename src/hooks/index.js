/**
 * Barrel export for hooks.
 *
 * Stateful, lifecycle-bound logic. If a helper needs no component lifecycle it
 * belongs in `@/utils` instead — that keeps this directory small and makes it
 * obvious what actually subscribes to something.
 *
 *   import { useMediaQuery, useTheme } from '@/hooks'
 *
 * `useLenis` is re-exported from `lenis/react` so every scroll-related hook is
 * imported from one place, and app code never reaches into the library path.
 */

export { useLenis } from 'lenis/react'

/* Environment + user preference */
export { useMediaQuery } from './useMediaQuery'
export { usePrefersReducedMotion } from './usePrefersReducedMotion'

/* Scroll */
export { useScrollDirection } from './useScrollDirection'
export { useLockScroll } from './useLockScroll'
export { useActiveSection } from './useActiveSection'
export { useAnchorScroll } from './useAnchorScroll'

/* Pointer */
export { useMousePosition } from './useMousePosition'

/* App state */
export { useTheme } from './useTheme'
