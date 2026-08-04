import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

import { Logo } from '@/components/ui'
import { DURATION, EASE } from '@/animations'
import { SITE } from '@/data'
import { useLockScroll } from '@/hooks'

/**
 * Minimum time the loader stays up, in ms.
 *
 * Not padding for its own sake: on a warm cache the page is ready in ~50ms, and
 * a loader that appears and vanishes inside one frame reads as a flash of
 * broken layout. Holding briefly makes it look intentional — and short enough
 * that it never becomes the reason someone waits.
 */
const MINIMUM_VISIBLE = 500

/**
 * Hard ceiling, in ms.
 *
 * A loader waiting on a promise that never settles is worse than no loader: it
 * hides a working page behind a spinner indefinitely. A slow font, a blocked
 * CDN, or a `document.fonts` implementation that hangs must never be able to do
 * that, so the ceiling runs independently of the thing being waited on.
 */
const MAXIMUM_VISIBLE = 2500

/**
 * First-paint loading screen.
 *
 * Shows only on initial load. It lives in the shell, which mounts once, so
 * route changes never replay it — a loader between pages of an app someone is
 * already using is an interruption, not polish.
 *
 * WHAT IT WAITS FOR
 * Webfonts, and nothing else. They are the one asset that visibly changes the
 * page *after* it paints: text renders in the fallback face, then reflows when
 * the real one arrives. Covering that swap is most of what a loader is for
 * here. Images are deliberately not awaited — they are lazy-loaded below the
 * fold, and holding the screen for content nobody has scrolled to is exactly
 * the anti-pattern this is trying to avoid.
 *
 * Scroll is locked while it is up, so nobody scrolls a page they cannot see and
 * arrives somewhere unexpected when it lifts.
 */
export function PageLoader() {
  const [isLoading, setIsLoading] = useState(true)

  useLockScroll(isLoading)

  useEffect(() => {
    let timeoutId
    const startedAt = performance.now()

    const dismiss = () => {
      // Top up to the minimum if readiness arrived sooner than that.
      const elapsed = performance.now() - startedAt
      const remaining = Math.max(0, MINIMUM_VISIBLE - elapsed)
      timeoutId = setTimeout(() => setIsLoading(false), remaining)
    }

    // `?? Promise.resolve()` rather than an optional chain: `document.fonts` is
    // absent in some engines and test environments, and `?.ready` would yield
    // `undefined`, which has no `.then`.
    const fontsReady = document.fonts?.ready ?? Promise.resolve()
    fontsReady.then(dismiss).catch(dismiss)

    const failsafe = setTimeout(() => setIsLoading(false), MAXIMUM_VISIBLE)

    return () => {
      clearTimeout(timeoutId)
      clearTimeout(failsafe)
    }
  }, [])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          // `role="status"` announces the state without stealing focus, which
          // `role="alert"` would.
          role="status"
          aria-live="polite"
          aria-label="Loading"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: DURATION.slow, ease: EASE.outExpo }}
          className="fixed inset-0 z-max grid place-items-center bg-canvas"
        >
          <div className="flex flex-col items-center gap-8">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: DURATION.base, ease: EASE.outExpo }}
            >
              {/* No href — a logo link during load would push a history entry
                  and navigate away from a page that has not rendered yet. */}
              <Logo label={SITE.name} href={undefined} className="text-2xl" />
            </motion.div>

            {/*
              Indeterminate progress rail. The real figure is unknowable at this
              point, and a fabricated percentage that snaps to 100% is worse than
              an honest sweep. Transform only, so it composites.
            */}
            <span className="relative block h-px w-32 overflow-hidden bg-line">
              <motion.span
                className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-accent to-transparent"
                animate={{ x: ['-100%', '250%'] }}
                transition={{ duration: 1.1, ease: 'easeInOut', repeat: Infinity }}
              />
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
