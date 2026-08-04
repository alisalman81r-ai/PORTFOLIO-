import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

import { DURATION, EASE } from '@/animations'
import { cn } from '@/utils'
import { usePrefersReducedMotion } from '@/hooks'

/**
 * Cycles through words with a vertical masked swap.
 *
 * TWO PROBLEMS THIS SOLVES THAT NAIVE VERSIONS DO NOT
 * ---------------------------------------------------
 * 1. LAYOUT SHIFT. Words have different widths, so swapping them reflows
 *    everything after — a visible twitch on each cycle. Here every word is
 *    rendered into the *same CSS grid cell*; the invisible ones still
 *    contribute to intrinsic width, so the container is permanently as wide as
 *    the longest word. No measurement, no ResizeObserver, no shift.
 *
 * 2. ACCESSIBILITY. An element whose text changes every few seconds is hostile
 *    to screen readers — it either re-announces constantly or reads a fragment.
 *    The full list is exposed once in visually-hidden text and the animated
 *    layer is `aria-hidden`, so assistive tech gets a stable, complete phrase.
 *
 * Reduced motion renders the first word statically; a word that changes on a
 * timer is itself motion, so slowing the transition would not be enough.
 *
 * @param {object} props
 * @param {string[]} props.items Words to cycle. Similar lengths work best —
 *   the reserved width is the longest, so an outlier leaves a gap beside all
 *   the others.
 * @param {number} [props.interval=2600] Milliseconds each word is held. Below
 *   ~2000 it becomes unreadable.
 * @param {string} [props.className]
 */
export function RotatingText({ items, interval = 2600, className, ...rest }) {
  const [index, setIndex] = useState(0)
  const prefersReducedMotion = usePrefersReducedMotion()

  const longest = useMemo(
    () => items.reduce((a, b) => (b.length > a.length ? b : a), ''),
    [items],
  )

  useEffect(() => {
    if (prefersReducedMotion || items.length < 2) return

    const id = setInterval(() => {
      setIndex((current) => (current + 1) % items.length)
    }, interval)

    return () => clearInterval(id)
  }, [items.length, interval, prefersReducedMotion])

  const word = items[index] ?? ''

  return (
    <span className={cn('relative inline-grid overflow-hidden align-bottom', className)} {...rest}>
      {/* Read once by assistive tech; never announced again as it cycles. */}
      <span className="sr-only">{items.join(', ')}</span>

      {/* Width reservation. Invisible but laid out, so the grid cell is sized
          to the longest word and the line can never reflow. */}
      <span aria-hidden="true" className="invisible col-start-1 row-start-1 whitespace-nowrap">
        {longest}
      </span>

      {prefersReducedMotion ? (
        <span aria-hidden="true" className="col-start-1 row-start-1 whitespace-nowrap">
          {word}
        </span>
      ) : (
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={word}
            aria-hidden="true"
            className="col-start-1 row-start-1 whitespace-nowrap"
            initial={{ y: '105%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            exit={{ y: '-105%', opacity: 0 }}
            transition={{ duration: DURATION.base, ease: EASE.outExpo }}
          >
            {word}
          </motion.span>
        </AnimatePresence>
      )}
    </span>
  )
}
