import { useEffect, useState } from 'react'

/**
 * Track which page section is currently in view.
 *
 * Drives the navigation's active state on a single-page layout.
 *
 * WHY IntersectionObserver AND NOT A SCROLL HANDLER
 * -------------------------------------------------
 * A scroll listener would run `getBoundingClientRect()` on every section on
 * every frame — each call forces a synchronous layout recalculation, and doing
 * nine of them per frame is a guaranteed jank source. IntersectionObserver is
 * computed off the main thread and only fires when a threshold is actually
 * crossed.
 *
 * The `rootMargin` shrinks the viewport to a horizontal band across its middle.
 * A section becomes active when it crosses that band rather than when it first
 * peeks in from the bottom, which is what makes the highlight change at the
 * moment it feels correct rather than early.
 *
 * Ids that have no matching element are skipped silently — sections declared in
 * `data/navigation.js` before they exist simply never activate.
 *
 * @param {string[]} sectionIds Ids to watch, in document order.
 * @param {object} [options]
 * @param {string} [options.rootMargin='-45% 0px -45% 0px'] Activation band.
 * @returns {string|null} Id of the active section, or null before any is hit.
 *
 * @example
 * const active = useActiveSection(SECTION_IDS)
 * <a aria-current={active === link.id ? 'true' : undefined} />
 */
export function useActiveSection(sectionIds, { rootMargin = '-45% 0px -45% 0px' } = {}) {
  const [activeId, setActiveId] = useState(null)

  // Joined into a primitive so a fresh array literal from the caller does not
  // tear down and rebuild the observer on every render.
  const key = sectionIds.join(',')

  useEffect(() => {
    const ids = key.split(',').filter(Boolean)
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((element) => element !== null)

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          // Only promote on entry. Without this, scrolling out of the last
          // section would clear the highlight and leave nothing selected.
          if (entry.isIntersecting) setActiveId(entry.target.id)
        }
      },
      { rootMargin, threshold: 0 },
    )

    elements.forEach((element) => observer.observe(element))

    return () => observer.disconnect()
  }, [key, rootMargin])

  return activeId
}
