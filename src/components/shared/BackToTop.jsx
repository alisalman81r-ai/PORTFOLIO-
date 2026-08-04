import { AnimatePresence, motion } from 'motion/react'

import { Icon } from '@/components/ui'
import { SPRING } from '@/animations'
import { useLenis, useScrollDirection } from '@/hooks'
import { cn } from '@/utils'

/** Distance scrolled before the control is worth offering, in pixels. */
const REVEAL_AFTER = 900

/**
 * Floating return-to-top control.
 *
 * Appears once the visitor is far enough down that scrolling back by hand would
 * be a chore. Below that threshold it is clutter — the page is still near the
 * top and the header is one flick away.
 *
 * Scrolling is handed to Lenis rather than `window.scrollTo`, so the trip back
 * uses the same easing as every other scroll on the site. A native jump would
 * fight Lenis and produce a visible lurch as it animated back from wherever the
 * browser had put the page.
 *
 * `useScrollDirection` is reused rather than adding a second scroll listener —
 * it already reports position from the single Lenis subscription the header
 * uses, and subscribing again for one number would be waste.
 */
export function BackToTop({ className }) {
  const lenis = useLenis()
  const { scrollY } = useScrollDirection({ threshold: 40 })

  const isVisible = scrollY > REVEAL_AFTER

  const handleClick = () => {
    if (lenis) {
      lenis.scrollTo(0)
    } else {
      // Lenis absent (reduced motion, or not yet mounted) — native still works.
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          type="button"
          onClick={handleClick}
          // Icon-only, so the label is the entire accessible name — without it
          // this announces as "button".
          aria-label="Back to top"
          initial={{ opacity: 0, scale: 0.8, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 12 }}
          transition={SPRING.snappy}
          className={cn(
            // `z-drawer`, below `z-modal`: an open dialog should cover this, not
            // have a floating button hovering over it.
            'btn btn-icon glass fixed right-gutter bottom-8 z-drawer',
            'border-glass-line text-ink shadow-lifted',
            'hover:border-accent/40 hover:text-accent',
            className,
          )}
        >
          {/* Reuses the back arrow rotated a quarter turn, rather than adding a
              near-duplicate glyph to the icon registry for one usage. */}
          <Icon name="prev" className="size-5 rotate-90" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
