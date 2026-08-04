/**
 * Barrel export for hooks.
 *
 *   import { useMediaQuery, usePrefersReducedMotion } from '@/hooks'
 *
 * `useLenis` is re-exported from `lenis/react` so every scroll-related hook is
 * imported from one place.
 */

export { useLenis } from 'lenis/react'

export { useMediaQuery } from './useMediaQuery'
export { usePrefersReducedMotion } from './usePrefersReducedMotion'
export { useScrollDirection } from './useScrollDirection'
export { useLockScroll } from './useLockScroll'
export { useTheme } from './useTheme'
