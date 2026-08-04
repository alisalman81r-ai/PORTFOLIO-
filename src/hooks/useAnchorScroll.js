import { useCallback } from 'react'
import { useLenis } from 'lenis/react'

/**
 * Offset applied when scrolling to an anchor, in pixels.
 *
 * The floating header is `--spacing-header` tall and sits inset from the top,
 * so a target scrolled flush to the viewport edge would sit underneath it.
 * Negative because Lenis measures from the top of the target.
 */
const HEADER_OFFSET = -112

/**
 * Returns a click handler for in-page anchor links.
 *
 * Shared by the desktop nav and the mobile menu so scroll behaviour cannot
 * drift between them.
 *
 * WHY NOT JUST LET THE BROWSER DO IT
 * ----------------------------------
 * A native anchor jump sets `window.scrollTo` instantly, which Lenis then
 * animates *back from* — producing a visible lurch. Driving Lenis directly
 * gives one smooth motion, and lets the header offset be applied.
 *
 * Targets that do not exist yet are handled deliberately: the default is
 * prevented and nothing happens, rather than pushing a dead `#hash` into the
 * URL bar. Every nav link is declared before its section is built, so this is
 * the normal path, not an edge case.
 *
 * @returns {(event: React.MouseEvent, href: string) => void}
 */
export function useAnchorScroll() {
  const lenis = useLenis()

  return useCallback(
    (event, href) => {
      if (typeof href !== 'string' || !href.startsWith('#')) return

      const target = document.querySelector(href)

      if (!target) {
        event.preventDefault()
        return
      }

      event.preventDefault()

      if (lenis) {
        lenis.scrollTo(target, { offset: HEADER_OFFSET })
      } else {
        // Lenis is disabled or not yet mounted — native scroll still works.
        target.scrollIntoView({ behavior: 'smooth' })
      }

      // Keep the URL shareable without triggering a second native jump.
      window.history.replaceState(null, '', href)
    },
    [lenis],
  )
}
