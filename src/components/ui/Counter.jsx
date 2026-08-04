import { useEffect, useRef } from 'react'
import { animate, useInView } from 'motion/react'

import { usePrefersReducedMotion } from '@/hooks'
import { cn } from '@/utils'

/**
 * Number that counts up the first time it scrolls into view.
 *
 * WRITES TO THE DOM, NOT TO STATE
 * -------------------------------
 * The obvious implementation stores the current value in `useState` and updates
 * it from `onUpdate`. That re-renders this component — and everything below it
 * in the subtree — on every animation frame, sixty times a second, per counter.
 * With four counters animating together that is 240 renders a second to change
 * some text.
 *
 * Motion's `animate()` drives a plain number and the callback writes
 * `textContent` directly. React renders once; the browser does the rest.
 *
 * ACCESSIBILITY
 * A number ticking through hundreds of intermediate values is noise to a screen
 * reader — and with a live region it would be announced repeatedly. So the
 * animated node is `aria-hidden` and the final value is exposed once as
 * visually-hidden text. Assistive tech reads "12 projects completed"; everyone
 * else sees it count.
 *
 * @param {object} props
 * @param {number} props.value Final value.
 * @param {string} [props.suffix] Rendered after the number, e.g. '+' or 'h'.
 * @param {string} [props.label] Accessible description appended to the value.
 * @param {number} [props.duration=1.8] Seconds. Longer reads as slow rather
 *   than impressive.
 * @param {string} [props.className]
 */
export function Counter({ value, suffix = '', label, duration = 1.8, className }) {
  const nodeRef = useRef(null)
  const containerRef = useRef(null)
  // `once` — a counter that re-runs every time it scrolls past is a gimmick.
  const inView = useInView(containerRef, { once: true, amount: 0.4 })
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const node = nodeRef.current
    if (!node || !inView) return

    // A number animating on its own is motion. Reduced motion means show the
    // result, not show it more slowly.
    if (prefersReducedMotion) {
      node.textContent = String(value)
      return
    }

    const controls = animate(0, value, {
      duration,
      // Decelerating: fast at the start, settling into the final figure — the
      // opposite reads as the page struggling.
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        node.textContent = String(Math.round(latest))
      },
    })

    return () => controls.stop()
  }, [inView, value, duration, prefersReducedMotion])

  return (
    <span ref={containerRef} className={cn('inline-flex items-baseline', className)}>
      <span className="sr-only">
        {value}
        {suffix}
        {label ? ` ${label}` : ''}
      </span>

      <span aria-hidden="true" className="tabular-nums">
        {/* Starts at 0 so the first paint matches the animation's first frame —
            rendering the final value would flash it before counting up. */}
        <span ref={nodeRef}>0</span>
        {suffix}
      </span>
    </span>
  )
}
