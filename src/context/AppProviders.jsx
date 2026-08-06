import { MotionConfig } from 'motion/react'

import { AppReadyProvider } from './AppReadyProvider'
import { ThemeProvider } from './ThemeProvider'
import { EASE, DURATION } from '@/animations'

/**
 * Single composition point for every app-wide provider.
 *
 * Keeps `main.jsx` flat as providers are added — new context goes here, not
 * into an ever-deepening pyramid at the entry point.
 *
 * `MotionConfig`:
 * - `reducedMotion="user"` makes every Motion component respect the OS setting
 *   automatically, disabling transform/layout animation while keeping opacity.
 *   This is the JS counterpart to the CSS media query in `styles/base.css`.
 * - `transition` sets the default curve, so components only specify what differs.
 *
 * `AppReadyProvider` sits inside `MotionConfig` and outside everything that
 * animates: it publishes when the first-load loader has finished, which the hero
 * waits for before playing its entrance.
 */
export function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <MotionConfig
        reducedMotion="user"
        transition={{ duration: DURATION.base, ease: EASE.outExpo }}
      >
        <AppReadyProvider>{children}</AppReadyProvider>
      </MotionConfig>
    </ThemeProvider>
  )
}
