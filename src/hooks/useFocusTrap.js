import { useEffect } from 'react'

/**
 * Elements that can receive keyboard focus.
 *
 * `[tabindex]:not([tabindex="-1"])` catches deliberately-focusable non-controls
 * (a scrollable panel, for instance) while excluding elements that were removed
 * from the tab order on purpose.
 */
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Confines keyboard focus to a container while it is open.
 *
 * Required for anything modal. Without it, Tab walks straight out of the dialog
 * and into the page behind it — where the user is now interacting with content
 * they cannot see, with no indication of where focus went.
 *
 * WHAT IT HANDLES
 *   - Moves focus in on open, to the first focusable element (or the container).
 *   - Wraps Tab and Shift+Tab at both ends.
 *   - Calls `onEscape` on Escape.
 *   - Restores focus to whatever was focused before, on close.
 *
 * The focusable list is re-queried on every Tab rather than captured once: a
 * dialog's contents change as it animates in, and a stale list traps focus on
 * elements that no longer exist.
 *
 * @param {React.RefObject<HTMLElement>} ref Container to trap within.
 * @param {object} [options]
 * @param {boolean} [options.active=true] Set false to disable without unmounting.
 * @param {() => void} [options.onEscape]
 *
 * @example
 * const panelRef = useRef(null)
 * useFocusTrap(panelRef, { onEscape: onClose })
 */
export function useFocusTrap(ref, { active = true, onEscape } = {}) {
  useEffect(() => {
    const node = ref.current
    if (!active || !node) return

    // Captured before focus moves, so it can be handed back on close.
    const previouslyFocused = document.activeElement

    const getFocusable = () =>
      [...node.querySelectorAll(FOCUSABLE)].filter(
        // `offsetParent === null` catches `display: none` subtrees, which are
        // still matched by the selector but cannot actually be focused.
        (element) => element.offsetParent !== null || element === node,
      )

    const initial = getFocusable()[0] ?? node
    initial.focus()

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onEscape?.()
        return
      }

      if (event.key !== 'Tab') return

      const focusable = getFocusable()
      if (focusable.length === 0) {
        event.preventDefault()
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      // Guard: the trigger may have unmounted while the dialog was open.
      if (previouslyFocused instanceof HTMLElement && document.contains(previouslyFocused)) {
        previouslyFocused.focus()
      }
    }
  }, [ref, active, onEscape])
}
