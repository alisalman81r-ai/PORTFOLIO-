import { useEffect } from 'react'
import { useLenis } from 'lenis/react'

/**
 * Freeze page scrolling while an overlay is open (nav menu, modal, lightbox).
 *
 * Stops Lenis *and* sets `overflow: hidden` on <html>. Both are required:
 * Lenis handles wheel and touch, but native keyboard scrolling (space, Page
 * Down, arrow keys) bypasses it and needs the CSS lock.
 *
 * Scrollbar-gutter is reserved globally in `base.css`, so locking does not
 * shift the layout.
 *
 * @param {boolean} locked
 *
 * @example
 * const [menuOpen, setMenuOpen] = useState(false)
 * useLockScroll(menuOpen)
 */
export function useLockScroll(locked) {
  const lenis = useLenis()

  useEffect(() => {
    if (!locked) return

    const { style } = document.documentElement
    const previousOverflow = style.overflow

    lenis?.stop()
    style.overflow = 'hidden'

    return () => {
      style.overflow = previousOverflow
      lenis?.start()
    }
  }, [locked, lenis])
}
