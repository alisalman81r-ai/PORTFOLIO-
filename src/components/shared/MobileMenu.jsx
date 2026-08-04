import { useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'

import { DURATION, EASE, STAGGER } from '@/animations'
import { NAV_LINKS, PERSONAL, SOCIAL_LINKS } from '@/data'
import { useAnchorScroll } from '@/hooks'
import { cn } from '@/utils'

/** Panel slides down as a whole; its contents stagger in behind it. */
const panel = {
  hidden: { opacity: 0, y: '-2%' },
  visible: {
    opacity: 1,
    y: '0%',
    transition: {
      duration: DURATION.base,
      ease: EASE.outExpo,
      staggerChildren: STAGGER.base,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: '-2%',
    // Exit is faster than entry. A slow dismissal feels unresponsive — the
    // user has already decided, and the animation should get out of the way.
    transition: { duration: DURATION.fast, ease: EASE.outQuart },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION.base, ease: EASE.outExpo } },
}

/**
 * Full-screen navigation overlay for small viewports.
 *
 * Rendered inside `<AnimatePresence>` by `Header`, so it is only mounted while
 * open and its exit animation completes before unmount.
 *
 * ACCESSIBILITY
 * - `role="dialog"` + `aria-modal` tell assistive tech the rest of the page is
 *   inert while this is open.
 * - Focus moves to the first link on open, so keyboard users are not left
 *   tabbing from the top of an invisible document.
 * - Escape closes it — expected of anything modal.
 * - Tab is trapped within the panel; without it, focus walks into the page
 *   behind the overlay where nothing is visible.
 * - Focus is returned to the toggle by `Header` on close.
 *
 * @param {object} props
 * @param {string} props.id Matches the toggle's `aria-controls`.
 * @param {() => void} props.onClose
 * @param {string|null} props.activeId Currently visible section.
 */
export function MobileMenu({ id, onClose, activeId }) {
  const panelRef = useRef(null)
  const handleAnchorClick = useAnchorScroll()

  // Move focus in on open, and keep Tab inside the panel while it is there.
  useEffect(() => {
    const node = panelRef.current
    if (!node) return

    const focusables = node.querySelectorAll('a[href], button:not([disabled])')
    focusables[0]?.focus()

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (event.key !== 'Tab' || focusables.length === 0) return

      const first = focusables[0]
      const last = focusables[focusables.length - 1]

      // Wrap at both ends so focus cycles rather than escaping the dialog.
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const handleLinkClick = (event, href) => {
    handleAnchorClick(event, href)
    onClose()
  }

  return (
    <motion.div
      ref={panelRef}
      id={id}
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
      variants={panel}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={cn(
        // Sits at `overlay`, deliberately BELOW the header's `drawer` level.
        // The control that closes this panel lives in the header, so an
        // overlay stacked above it would cover its own dismiss button and trap
        // the user with only the Escape key.
        'fixed inset-0 z-overlay flex flex-col overflow-y-auto',
        // Near-opaque rather than `glass-strong`. Backdrop blur is a progressive
        // enhancement — it is dropped under `prefers-reduced-transparency`, on
        // low-power modes, and wherever compositing is unavailable. Legibility
        // of the primary navigation cannot depend on it, so the opacity carries
        // the contrast and the blur only adds depth.
        'bg-canvas/95 backdrop-blur-xl',
        'px-gutter pt-28 pb-10 lg:hidden',
      )}
    >
      <nav aria-label="Mobile" className="flex-1">
        <ul className="flex flex-col">
          {NAV_LINKS.map((link, index) => {
            const isActive = activeId === link.id

            return (
              <motion.li key={link.id} variants={item} className="border-b border-line">
                <a
                  href={link.href}
                  onClick={(event) => handleLinkClick(event, link.href)}
                  aria-current={isActive ? 'true' : undefined}
                  className={cn(
                    'group flex items-baseline gap-4 py-4 transition-colors duration-fast',
                    isActive ? 'text-accent' : 'text-ink hover:text-accent',
                  )}
                >
                  <span aria-hidden="true" className="font-mono text-xs text-faint">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <span className="heading-xs">{link.label}</span>

                  <ArrowUpRight
                    aria-hidden="true"
                    className="ml-auto size-5 self-center text-faint transition-transform duration-base ease-out-expo group-hover:translate-x-1 group-hover:-translate-y-1"
                  />
                </a>
              </motion.li>
            )
          })}
        </ul>
      </nav>

      <motion.div variants={item} className="mt-10 flex flex-col gap-6">
        <a href={PERSONAL.resumeUrl} className="btn btn-primary w-full">
          Download résumé
        </a>

        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {SOCIAL_LINKS.map((social) => (
            <li key={social.id}>
              <a
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="eyebrow link-underline hover:text-ink"
              >
                {social.label}
              </a>
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  )
}
