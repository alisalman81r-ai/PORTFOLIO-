import { useLocation, useOutlet } from 'react-router-dom'

import { PageTransition } from './PageTransition'
import { SmoothScroll } from './SmoothScroll'
import {
  BackToTop,
  Cursor,
  Footer,
  Header,
  PageLoader,
  ScrollProgress,
  ScrollToTop,
} from '@/components/shared'
import { NoiseOverlay } from '@/components/ui'

/**
 * Application shell — the persistent chrome every route renders inside.
 *
 * Owns what must survive navigation:
 *   - Lenis smooth scrolling (a remount would reset scroll physics mid-page)
 *   - Scroll reset on route change
 *   - The page-transition boundary
 *   - Global chrome: loader, cursor, progress bar, back-to-top, header, footer
 *   - Accessibility landmarks (skip link, `#main`)
 *
 * Everything except the page itself sits *outside* `<PageTransition>`, and that
 * placement is the whole reason a shell exists: chrome persists, content
 * transitions. Put the header inside and it would re-mount and replay its
 * entrance on every navigation.
 *
 * THE LOADER MOUNTS HERE, NOT IN `App`
 * This component mounts exactly once for the life of the session, so the loader
 * runs on first paint and never again. Mounting it per-route would replay it on
 * every navigation — a loading screen between pages of a site someone is
 * already using is an interruption, not polish.
 *
 * WHY `useOutlet()` INSTEAD OF `<Outlet />`
 * `<Outlet />` renders whatever the current route is, so on navigation its
 * contents swap instantly and there is nothing left to animate out.
 * `useOutlet()` returns the page as a *value*, which `<PageTransition>` keys by
 * pathname — AnimatePresence then holds the previous element until its exit
 * finishes, giving a real crossfade rather than a hard cut.
 */
export function MainLayout() {
  const outlet = useOutlet()
  const { pathname } = useLocation()

  return (
    <SmoothScroll>
      <PageLoader />
      <ScrollToTop />

      {/* Renders nothing on touch devices or under reduced motion, and only
          then hides the native pointer — see `Cursor`. */}
      <Cursor />

      <ScrollProgress />

      {/* WCAG 2.4.1 — lets keyboard users bypass the nav instead of tabbing
          through every link on every page. Hidden until focused. */}
      <a href="#main" className="skip-link btn btn-primary btn-sm rounded-none">
        Skip to content
      </a>

      {/* Grain sits above every layer and below all content, unifying the
          gradients, glass, and canvas into one surface. */}
      <NoiseOverlay />

      <Header />

      <PageTransition transitionKey={pathname} variant="fade" id="main">
        {outlet}
      </PageTransition>

      <Footer />

      <BackToTop />
    </SmoothScroll>
  )
}
