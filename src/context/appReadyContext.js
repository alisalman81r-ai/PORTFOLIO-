import { createContext } from 'react'

/**
 * Readiness context object and its timings.
 *
 * Component-free on purpose, matching `themeContext.js`: Fast Refresh only
 * preserves state for a module that exports components *or* plain values, never
 * both.
 */

/**
 * Minimum time the loader stays up, in ms.
 *
 * Not padding for its own sake: on a warm cache the page is ready in ~50ms, and
 * a loader that appears and vanishes inside one frame reads as a flash of broken
 * layout. Holding briefly makes it look intentional — and short enough that it
 * never becomes the reason someone waits.
 */
export const LOADER_MINIMUM_VISIBLE = 500

/**
 * Hard ceiling, in ms.
 *
 * A loader waiting on a promise that never settles is worse than no loader: it
 * hides a working page behind a spinner indefinitely. A slow font, a blocked
 * CDN, or a `document.fonts` implementation that hangs must never be able to do
 * that, so the ceiling runs independently of the thing being waited on.
 */
export const LOADER_MAXIMUM_VISIBLE = 2500

/**
 * @typedef {object} AppReadyContextValue
 * @property {boolean} isReady True once the loader has begun dismissing.
 */

export const AppReadyContext = createContext(
  /** @type {AppReadyContextValue|null} */ (null),
)
