import { useRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'

import { Icon } from './Icon'
import { DURATION, EASE } from '@/animations'
import { useFocusTrap, useLockScroll } from '@/hooks'
import { cn } from '@/utils'

const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DURATION.fast } },
  exit: { opacity: 0, transition: { duration: DURATION.fast } },
}

const panel = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: DURATION.base, ease: EASE.outExpo },
  },
  exit: {
    opacity: 0,
    y: 12,
    scale: 0.99,
    // Faster out than in. The user has already decided to dismiss; a slow exit
    // reads as the interface not keeping up.
    transition: { duration: DURATION.fast, ease: EASE.outQuart },
  },
}

/**
 * Accessible modal dialog.
 *
 * RENDERED THROUGH A PORTAL, AND THAT IS LOAD-BEARING
 * --------------------------------------------------
 * The dialog mounts on `document.body` rather than in place. A `position: fixed`
 * element is normally viewport-relative — but an ancestor with `transform`,
 * `filter`, or `contain` becomes its containing block instead, which would pin
 * this dialog inside a section and let that section's `overflow-x-clip` crop it.
 * Motion applies `transform` to any animating ancestor, so this is a live risk
 * on every section here, not a theoretical one. The portal sidesteps all of it.
 *
 * ACCESSIBILITY CONTRACT
 *   - `role="dialog"` + `aria-modal` tell assistive tech the rest of the page
 *     is inert.
 *   - `aria-labelledby` names it from the visible heading, so it is never
 *     announced as an unlabelled dialog.
 *   - Focus moves in on open, is trapped, and returns to the trigger on close
 *     (via `useFocusTrap`).
 *   - Escape closes. Backdrop click closes; a click starting inside and ending
 *     on the backdrop does not, which is what stops a text selection drag from
 *     dismissing the dialog.
 *   - Page scroll is locked while open, through Lenis and CSS both.
 *
 * @param {object} props
 * @param {boolean} props.open
 * @param {() => void} props.onClose
 * @param {string} props.labelledBy Id of the heading inside `children`.
 * @param {string} [props.className] Applied to the panel.
 * @param {React.ReactNode} props.children
 */
export function Modal({ open, onClose, labelledBy, className, children }) {
  const panelRef = useRef(null)
  // Tracks whether the pointer went down on the backdrop itself, so a drag that
  // began on text inside the panel and released outside does not close it.
  const pointerDownOnBackdrop = useRef(false)

  useLockScroll(open)
  useFocusTrap(panelRef, { active: open, onEscape: onClose })

  const handlePointerDown = (event) => {
    pointerDownOnBackdrop.current = event.target === event.currentTarget
  }

  const handleClick = (event) => {
    if (event.target === event.currentTarget && pointerDownOnBackdrop.current) onClose()
    pointerDownOnBackdrop.current = false
  }

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          variants={backdrop}
          initial="hidden"
          animate="visible"
          exit="exit"
          onPointerDown={handlePointerDown}
          onClick={handleClick}
          className={cn(
            'fixed inset-0 z-modal flex items-start justify-center overflow-y-auto',
            'bg-scrim backdrop-blur-sm',
            'p-4 sm:p-6 lg:p-10',
          )}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            variants={panel}
            className={cn(
              'relative my-auto w-full max-w-4xl rounded-panel border border-line',
              'bg-surface shadow-floating',
              className,
            )}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="btn btn-icon btn-ghost absolute top-4 right-4 z-raised bg-surface/80 backdrop-blur-sm"
            >
              <Icon name="close" className="size-5" />
            </button>

            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
