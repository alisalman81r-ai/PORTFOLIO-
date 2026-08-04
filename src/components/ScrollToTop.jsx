import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useLenis } from 'lenis/react'

/**
 * Reset scroll position on route change.
 *
 * React Router's own `<ScrollRestoration>` writes to `window.scrollTo`, which
 * Lenis then animates back from — producing a visible scroll-up on every
 * navigation. Driving Lenis directly with `immediate: true` avoids that.
 *
 * A hash in the URL is left alone so in-page anchors still work.
 *
 * Renders nothing.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation()
  const lenis = useLenis()

  useEffect(() => {
    if (hash) return

    if (lenis) {
      lenis.scrollTo(0, { immediate: true, force: true })
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash, lenis])

  return null
}
