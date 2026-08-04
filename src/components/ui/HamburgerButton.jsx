import { motion } from 'motion/react'

import { EASE } from '@/animations'
import { cn } from '@/utils'

/**
 * Two-bar menu toggle that morphs into a close icon.
 *
 * Built from two animated `<span>` bars rather than swapping a menu icon for an
 * X. The morph shows the user that the same control does both jobs, and it
 * keeps a single button in the tab order instead of two that trade places.
 *
 * ACCESSIBILITY
 * - `aria-expanded` announces open/closed state.
 * - `aria-controls` ties it to the menu's element id.
 * - `aria-label` changes with state, so the control is never just "button".
 * - The bars are `aria-hidden`; they are decoration, and the label carries the
 *   meaning.
 *
 * @param {object} props
 * @param {boolean} props.open
 * @param {() => void} props.onToggle
 * @param {string} props.controls Id of the menu element this opens.
 * @param {React.Ref<HTMLButtonElement>} [props.ref] Declared explicitly rather
 *   than left to `...rest`: React 19 passes `ref` as an ordinary prop, and
 *   naming it documents that callers can reach the element — the header uses it
 *   to restore focus when the menu closes.
 * @param {string} [props.className]
 */
export function HamburgerButton({ open, onToggle, controls, ref, className, ...rest }) {
  const transition = { duration: 0.32, ease: EASE.outExpo }

  return (
    <button
      ref={ref}
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-controls={controls}
      aria-label={open ? 'Close menu' : 'Open menu'}
      className={cn(
        'group relative grid size-11 shrink-0 place-items-center rounded-pill',
        'border border-line text-ink transition-colors duration-fast',
        'hover:border-line-strong hover:bg-elevated',
        className,
      )}
      {...rest}
    >
      <span aria-hidden="true" className="relative block h-3 w-5">
        {/* Bars translate to the centre first, then rotate. Doing both at once
            makes the ends visibly swing wide of the pivot. */}
        <motion.span
          className="absolute left-0 block h-px w-full origin-center bg-current"
          animate={open ? { top: '50%', rotate: 45 } : { top: '15%', rotate: 0 }}
          transition={transition}
        />
        <motion.span
          className="absolute left-0 block h-px w-full origin-center bg-current"
          animate={open ? { top: '50%', rotate: -45 } : { top: '85%', rotate: 0 }}
          transition={transition}
        />
      </span>
    </button>
  )
}
