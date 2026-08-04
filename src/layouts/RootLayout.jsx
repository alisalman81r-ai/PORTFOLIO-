import { useLocation, useOutlet } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'

import { SmoothScroll } from './SmoothScroll'
import { ScrollToTop } from '@/components'
import { pageTransition } from '@/animations'

/**
 * Application shell.
 *
 * Owns everything that persists across routes: smooth scrolling, scroll reset,
 * the page-transition boundary, and the accessibility landmarks. Header and
 * footer slot in here once they exist.
 *
 * `useOutlet()` is used instead of `<Outlet />` so the rendered page element can
 * be captured and keyed by pathname — that is what gives AnimatePresence a
 * stable identity to animate out before the next route animates in.
 */
export function RootLayout() {
  const outlet = useOutlet()
  const { pathname } = useLocation()

  return (
    <SmoothScroll>
      <ScrollToTop />

      <a href="#main" className="skip-link bg-accent text-accent-ink px-4 py-2 text-sm font-medium">
        Skip to content
      </a>

      {/* Header goes here */}

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

      {/* Footer goes here */}
    </SmoothScroll>
  )
}
