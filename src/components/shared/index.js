/**
 * Shared components — app-level infrastructure used across routes.
 *
 * These are neither design-system primitives (`ui/`) nor motion wrappers
 * (`animations/`). They are singletons and cross-cutting concerns: error
 * boundaries, scroll management, analytics, SEO heads, the custom cursor.
 *
 * Rule of thumb: if it would appear once per app rather than many times per
 * page, it belongs here.
 *
 *   import { ErrorBoundary } from '@/components/shared'
 */

export { ErrorBoundary } from './ErrorBoundary'
export { ScrollToTop } from './ScrollToTop'
