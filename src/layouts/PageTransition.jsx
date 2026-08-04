import { AnimatePresence, motion } from 'motion/react'

import { pageVariants } from '@/animations'
import { cn } from '@/utils'

/**
 * Route transition boundary.
 *
 * Wraps the routed page in an `<AnimatePresence>` keyed by pathname, so the
 * outgoing page can finish animating out before the incoming one starts.
 *
 * WHY THE PAGE IS PASSED AS A PROP RATHER THAN RENDERED HERE
 * `<Outlet />` renders whatever the current route is, so on navigation its
 * contents swap instantly and there is nothing left for AnimatePresence to
 * animate out. The shell resolves the page with `useOutlet()` and hands it over
 * as a *value*, which this keys by pathname — AnimatePresence then holds the
 * previous element in the tree until its exit finishes.
 *
 * `mode="wait"` sequences it, so two pages are never stacked and visible at
 * once. `initial={false}` suppresses the entrance on first load: the page is
 * already the thing the visitor came for, and animating it in behind the loader
 * only delays it.
 *
 * REDUCED MOTION is handled globally by `<MotionConfig reducedMotion="user">`
 * in `context/AppProviders.jsx` — transform is suppressed while opacity still
 * cross-fades, so every preset degrades to a plain fade automatically.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children The resolved page element.
 * @param {string} props.transitionKey Usually the pathname.
 * @param {keyof typeof pageVariants} [props.variant='fade'] Named feel.
 * @param {string} [props.id] Landmark id — pass `'main'` for the skip link target.
 * @param {string} [props.className]
 *
 * @example
 * <PageTransition transitionKey={pathname} variant="slideUp" id="main">
 *   {useOutlet()}
 * </PageTransition>
 */
export function PageTransition({
  children,
  transitionKey,
  variant = 'fade',
  id,
  className,
}) {
  const preset = pageVariants[variant] ?? pageVariants.fade

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.main
        key={transitionKey}
        id={id}
        initial={preset.initial}
        animate={preset.animate}
        exit={preset.exit}
        className={cn(className)}
      >
        {children}
      </motion.main>
    </AnimatePresence>
  )
}
