import { useLocation, useOutlet } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'

import { SmoothScroll } from './SmoothScroll'
import { ScrollToTop } from '@/components/shared'
import { pageTransition } from '@/animations'

/**
 * Application shell — the persistent chrome every route renders inside.
 *
 * Owns what must survive navigation:
 *   - Lenis smooth scrolling (a remount would reset scroll physics mid-page)
 *   - Scroll reset on route change
 *   - The page-transition boundary
 *   - Accessibility landmarks (skip link, `#main`)
 *
 * Header and Footer mount here, outside the animated region, so they stay put
 * while pages cross-fade beneath them. That distinction is the whole reason a
 * shell exists: chrome persists, content transitions.
 *
 * WHY `useOutlet()` INSTEAD OF `<Outlet />`
 * -----------------------------------------
 * `<Outlet />` renders whatever the current route is, so on navigation its
 * contents swap instantly and there is nothing left for AnimatePresence to
 * animate out. `useOutlet()` returns the page as a *value*, which we key by
 * pathname — AnimatePresence then holds the previous element in the tree until
 * its exit animation finishes, giving a real crossfade rather than a hard cut.
 *
 * `mode="wait"` sequences it: the outgoing page finishes before the incoming
 * one starts, so two pages are never stacked and visible at once.
 */
export function MainLayout() {
  const outlet = useOutlet()
  const { pathname } = useLocation()

  return (
    <SmoothScroll>
      <ScrollToTop />

      {/* WCAG 2.4.1 — lets keyboard users bypass the nav instead of tabbing
          through every link on every page. Hidden until focused. */}
      <a
        href="#main"
        className="skip-link btn btn-primary btn-sm rounded-none"
      >
        Skip to content
      </a>

      {/* <Header /> — mounts here, outside AnimatePresence, so it persists. */}

      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={pathname}
          id="main"
          initial={pageTransition.initial}
          animate={pageTransition.animate}
          exit={pageTransition.exit}
        >
          {outlet}
        </motion.main>
      </AnimatePresence>

      {/* <Footer /> */}
    </SmoothScroll>
  )
}
