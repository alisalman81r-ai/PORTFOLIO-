import { useEffect, useMemo, useState } from 'react'

import {
  AppReadyContext,
  LOADER_MAXIMUM_VISIBLE,
  LOADER_MINIMUM_VISIBLE,
} from './appReadyContext'

/**
 * Owns first-load readiness for the whole app.
 *
 * WHY THIS IS A PROVIDER AND NOT LOCAL STATE IN <PageLoader>
 * Two things need to know when the first paint is done, and they are in
 * different parts of the tree: the loader, which covers the screen until then,
 * and the hero, whose entrance is worth nothing if it plays underneath that
 * cover. Measured before this existed, the hero's choreography ran 1139–1851ms
 * while the loader lifted at 2301ms — the entire entrance, start to finish,
 * happened behind an opaque panel. Every visitor saw a static hero.
 *
 * Lifting the flag to context lets the loader keep owning *what it waits for*
 * while the hero decides *what to do when the wait ends*, with no prop drilling
 * through the layout and no second timer that could drift out of step with the
 * first.
 *
 * WHAT IT WAITS FOR
 * Webfonts, and nothing else. They are the one asset that visibly changes the
 * page *after* it paints: text renders in the fallback face, then reflows when
 * the real one arrives. Covering that swap is most of what the loader is for.
 * Images are deliberately not awaited — they are lazy-loaded below the fold, and
 * holding the screen for content nobody has scrolled to is exactly the
 * anti-pattern this is trying to avoid.
 */
export function AppReadyProvider({ children }) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    let timeoutId
    const startedAt = performance.now()

    const settle = () => {
      // Top up to the minimum if readiness arrived sooner than that.
      const elapsed = performance.now() - startedAt
      const remaining = Math.max(0, LOADER_MINIMUM_VISIBLE - elapsed)
      timeoutId = setTimeout(() => setIsReady(true), remaining)
    }

    // `?? Promise.resolve()` rather than an optional chain: `document.fonts` is
    // absent in some engines and test environments, and `?.ready` would yield
    // `undefined`, which has no `.then`.
    const fontsReady = document.fonts?.ready ?? Promise.resolve()
    fontsReady.then(settle).catch(settle)

    const failsafe = setTimeout(() => setIsReady(true), LOADER_MAXIMUM_VISIBLE)

    return () => {
      clearTimeout(timeoutId)
      clearTimeout(failsafe)
    }
  }, [])

  const value = useMemo(() => ({ isReady }), [isReady])

  return <AppReadyContext.Provider value={value}>{children}</AppReadyContext.Provider>
}
