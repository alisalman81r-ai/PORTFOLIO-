import { AnimatePresence, motion } from 'motion/react'
import { Moon, Sun } from 'lucide-react'

import { DURATION, EASE } from '@/animations'
import { useTheme } from '@/hooks'
import { cn } from '@/utils'

/**
 * Light/dark switch.
 *
 * The theme system has existed since the first commit — pre-paint resolution,
 * semantic tokens that re-point per theme, an accessible light palette — but
 * nothing ever exposed it. The light theme was reachable only by changing your
 * operating system preference, which is not a control.
 *
 * ACCESSIBILITY
 * A `<button>` with an `aria-pressed` state, not a checkbox or a `role="switch"`.
 * Both of those announce "on/off", which is meaningless here — neither theme is
 * the "on" one. A pressed toggle button announces the state plainly, and the
 * label says which theme a press will produce rather than which one is active,
 * because the label describes the *action*.
 *
 * MOTION
 * The two glyphs cross-fade and counter-rotate through 90°, so the switch reads
 * as one object turning rather than two icons swapping. `mode="wait"` keeps them
 * from overlapping mid-rotation. Transform and opacity only — no layout, no
 * paint. The rotation is skipped under reduced motion by the global
 * `<MotionConfig reducedMotion="user">`, leaving a plain fade.
 *
 * @param {object} props
 * @param {string} [props.className]
 */
export function ThemeToggle({ className }) {
  const { isDark, toggleTheme } = useTheme()
  const Icon = isDark ? Sun : Moon

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-pressed={isDark}
      // Names the outcome, not the current state — a label that reads
      // "Dark theme" leaves the user guessing what pressing it does.
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={cn(
        'btn btn-icon btn-ghost border border-line',
        'hover:border-accent/40 hover:text-accent',
        className,
      )}
    >
      <span className="relative grid size-5 place-items-center">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isDark ? 'sun' : 'moon'}
            initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
            transition={{ duration: DURATION.fast, ease: EASE.outExpo }}
            className="absolute grid place-items-center"
          >
            <Icon aria-hidden="true" className="size-5" strokeWidth={1.75} />
          </motion.span>
        </AnimatePresence>
      </span>
    </button>
  )
}
