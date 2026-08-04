import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

import { MobileMenu } from './MobileMenu'
import { HamburgerButton, Logo } from '@/components/ui'
import { Container } from '@/layouts'
import { DURATION, EASE, SPRING } from '@/animations'
import { NAV_LINKS, PERSONAL, SECTION_IDS, SITE } from '@/data'
import { useActiveSection, useAnchorScroll, useLockScroll, useScrollDirection } from '@/hooks'
import { cn } from '@/utils'

const MENU_ID = 'site-menu'

/**
 * Floating glass navigation bar.
 *
 * BEHAVIOUR
 * ---------
 * Three visual states driven by scroll, not by a single "scrolled" boolean:
 *
 *   at top      → transparent, no border. The nav should not compete with the
 *                 hero on first paint.
 *   scrolled    → glass, border, shadow. It now sits over content and needs to
 *                 separate from it.
 *   scrolling ↓ → retracts off-screen, and returns the moment the user scrolls
 *                 up. Reading gets the full viewport; navigating gets the nav
 *                 back instantly.
 *
 * The retract is deliberately disabled while the mobile menu is open — hiding
 * the bar that contains the close button would trap the user.
 *
 * THE MOVING INDICATOR
 * --------------------
 * A single pill element is shared across nav items via Motion's `layoutId`.
 * Motion measures its old and new positions and animates between them, so the
 * highlight appears to *travel* rather than cross-fade. It follows the hovered
 * item, and falls back to the section currently in view.
 *
 * @param {object} props
 * @param {string} [props.className]
 */
export function Header({ className }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [hoveredId, setHoveredId] = useState(null)

  const toggleRef = useRef(null)

  const { direction, atTop } = useScrollDirection({ threshold: 10, topOffset: 40 })
  const activeId = useActiveSection(SECTION_IDS)
  const handleAnchorClick = useAnchorScroll()

  useLockScroll(menuOpen)

  // Return focus to the toggle when the menu closes, so keyboard users resume
  // where they left off instead of at the top of the document.
  const wasOpen = useRef(false)
  useEffect(() => {
    if (wasOpen.current && !menuOpen) toggleRef.current?.focus()
    wasOpen.current = menuOpen
  }, [menuOpen])

  // Close on resize past the desktop breakpoint — otherwise the overlay stays
  // mounted and invisible (`lg:hidden`) while still holding the scroll lock.
  useEffect(() => {
    if (!menuOpen) return

    const query = window.matchMedia('(min-width: 64rem)')
    const handleChange = (event) => event.matches && setMenuOpen(false)

    query.addEventListener('change', handleChange)
    return () => query.removeEventListener('change', handleChange)
  }, [menuOpen])

  const hidden = direction === 'down' && !atTop && !menuOpen
  const highlightedId = hoveredId ?? activeId

  return (
    <>
      <motion.header
        initial={{ y: -120, opacity: 0 }}
        animate={{ y: hidden ? -120 : 0, opacity: 1 }}
        transition={{ duration: DURATION.base, ease: EASE.outExpo }}
        // `z-drawer`, not `z-header`: the header owns the toggle that closes
        // the mobile overlay, so it has to stay above it and clickable. The
        // pill also reads correctly on top — the hamburger morphs to an X in
        // place rather than a second close button appearing elsewhere.
        className={cn('fixed inset-x-0 top-0 z-drawer', className)}
      >
        <Container className="pt-4 lg:pt-6">
          <div
            className={cn(
              'flex items-center justify-between gap-3 rounded-pill px-3 py-2 lg:px-4',
              'transition-[background-color,border-color,box-shadow] duration-slow ease-out-quart',
              atTop && !menuOpen
                ? 'border border-transparent'
                : 'glass border-glass-line shadow-lifted',
            )}
          >
            <Logo
              label={SITE.name}
              onClick={(event) => handleAnchorClick(event, '#home')}
              className="pl-2"
            />

            {/* Desktop navigation. Hidden below lg — nine items cannot be
                legible in a pill at tablet width, so it becomes the overlay. */}
            <nav aria-label="Primary" className="hidden lg:block">
              <ul className="flex items-center" onMouseLeave={() => setHoveredId(null)}>
                {NAV_LINKS.map((link) => {
                  const isActive = activeId === link.id

                  return (
                    <li key={link.id} className="relative">
                      <a
                        href={link.href}
                        onClick={(event) => handleAnchorClick(event, link.href)}
                        onMouseEnter={() => setHoveredId(link.id)}
                        onFocus={() => setHoveredId(link.id)}
                        onBlur={() => setHoveredId(null)}
                        aria-current={isActive ? 'true' : undefined}
                        className={cn(
                          'relative block rounded-pill px-2.5 py-2 text-[0.8125rem] xl:px-3.5',
                          'transition-colors duration-fast',
                          isActive ? 'text-ink' : 'text-muted hover:text-ink',
                        )}
                      >
                        {/* Painted before the label and lifted above it by DOM
                            order alone. A negative z-index would drop it behind
                            the header's own glass background — the link creates
                            no stacking context of its own — and it would vanish. */}
                        {highlightedId === link.id && (
                          <motion.span
                            layoutId="nav-indicator"
                            aria-hidden="true"
                            transition={SPRING.snappy}
                            className="absolute inset-0 rounded-pill bg-elevated"
                          />
                        )}
                        <span className="relative">{link.label}</span>
                      </a>
                    </li>
                  )
                })}
              </ul>
            </nav>

            <div className="flex items-center gap-2">
              <a
                href={PERSONAL.resumeUrl}
                className="btn btn-primary btn-sm hidden sm:inline-flex"
              >
                Résumé
              </a>

              <HamburgerButton
                ref={toggleRef}
                open={menuOpen}
                onToggle={() => setMenuOpen((open) => !open)}
                controls={MENU_ID}
                className="lg:hidden"
              />
            </div>
          </div>
        </Container>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <MobileMenu
            id={MENU_ID}
            activeId={activeId}
            onClose={() => setMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
