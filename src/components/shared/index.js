/**
 * Shared components — app-level infrastructure used across routes.
 *
 * Neither design-system primitives (`ui/`) nor motion wrappers (`animations/`).
 * These are singletons and cross-cutting concerns: navigation, error
 * boundaries, scroll management.
 *
 * Rule of thumb: if it appears once per app rather than many times per page,
 * it belongs here.
 *
 *   import { Header } from '@/components/shared'
 */

export { Header } from './Header'
export { Footer } from './Footer'
export { Cursor } from './Cursor'
export { PageLoader } from './PageLoader'
export { ScrollProgress } from './ScrollProgress'
export { BackToTop } from './BackToTop'
export { MobileMenu } from './MobileMenu'
export { ErrorBoundary } from './ErrorBoundary'
export { ScrollToTop } from './ScrollToTop'
