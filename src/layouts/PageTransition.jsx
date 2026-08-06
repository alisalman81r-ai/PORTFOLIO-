import { useEffect, useRef } from 'react'
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
 * once.
 *
 * WHY THE FIRST-LOAD SUPPRESSION IS ON `motion.main`, NOT ON `AnimatePresence`
 * The entrance on first load is suppressed — the page is already the thing the
 * visitor came for, and fading it in behind the loader only delays it. But this
 * must NOT be done with `<AnimatePresence initial={false}>`, which is the
 * obvious-looking way to write it.
 *
 * `AnimatePresence` publishes that flag on `PresenceContext`, and *every*
 * descendant motion component reads it: `use-visual-state` treats
 * `presenceContext.initial === false` as "initial animation blocked" and renders
 * the element at its `animate` target instead of its `initial` one. Because this
 * boundary wraps the whole routed page, that silently disabled every entrance
 * animation on the site — the hero choreography and all 22 scroll reveals
 * rendered fully-formed, and their `whileInView` animations then ran from the
 * finished state to the finished state, which is a no-op.
 *
 * Put on `motion.main` instead, it blocks only this element. The context is not
 * poisoned, and `getCurrentTreeVariants` does not forward it: this component
 * passes object-form presets rather than variant labels, so it is not a
 * variant-controlling node and contributes nothing to `MotionContext`.
 *
 * The ref is read during render and flipped in an effect. Only a navigation can
 * re-render this, and by then the flag is already false — so the first page is
 * static and every subsequent one transitions.
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
  const isFirstRender = useRef(true)
  const suppressEntrance = isFirstRender.current

  useEffect(() => {
    isFirstRender.current = false
  }, [])

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={transitionKey}
        id={id}
        initial={suppressEntrance ? false : preset.initial}
        animate={preset.animate}
        exit={preset.exit}
        className={cn(className)}
      >
        {children}
      </motion.main>
    </AnimatePresence>
  )
}
