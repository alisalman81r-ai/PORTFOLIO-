import { useCallback, useSyncExternalStore } from 'react'

/**
 * Subscribe to a CSS media query.
 *
 * Built on `useSyncExternalStore` rather than `useState` + `useEffect`: the
 * value is read during render instead of after mount, so there is no flash of
 * the wrong branch on the first paint, and React never tears between the two.
 *
 * @param {string} query A media query string, e.g. '(min-width: 768px)'.
 * @returns {boolean} Whether the query currently matches.
 *
 * @example
 * const isDesktop = useMediaQuery('(min-width: 1024px)')
 */
export function useMediaQuery(query) {
  const subscribe = useCallback(
    (onChange) => {
      const list = window.matchMedia(query)
      list.addEventListener('change', onChange)
      return () => list.removeEventListener('change', onChange)
    },
    [query],
  )

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query])

  // Server snapshot — this app is client-rendered, but a stable `false` keeps
  // the hook safe if it is ever pre-rendered.
  const getServerSnapshot = useCallback(() => false, [])

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
