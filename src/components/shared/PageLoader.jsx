import { AnimatePresence, motion } from 'motion/react'

import { Logo } from '@/components/ui'
import { DURATION, EASE } from '@/animations'
import { SITE } from '@/data'
import { useAppReady, useLockScroll } from '@/hooks'

/**
 * First-paint loading screen.
 *
 * Shows only on initial load. It lives in the shell, which mounts once, so
 * route changes never replay it — a loader between pages of an app someone is
 * already using is an interruption, not polish.
 *
 * WHAT IT WAITS FOR is decided by `<AppReadyProvider>`, which owns the timing
 * and publishes it. This component only renders the cover, because the hero needs
 * the same signal to know when its entrance will actually be seen — two
 * independent timers would drift apart and the gate would stop lining up with
 * the fade.
 *
 * Scroll is locked while it is up, so nobody scrolls a page they cannot see and
 * arrives somewhere unexpected when it lifts.
 */
export function PageLoader() {
  const { isReady } = useAppReady()
  const isLoading = !isReady

  useLockScroll(isLoading)

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
