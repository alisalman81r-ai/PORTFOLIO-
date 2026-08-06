import { useEffect, useRef, useState } from 'react'

import { useMediaQuery, usePrefersReducedMotion } from '@/hooks'
import { cn } from '@/utils'

/**
 * Custom cursor: one small dot, tracking the pointer exactly.
 *
 * WHAT THIS USED TO BE, AND WHY IT IS NOT ANY MORE
 * There were two elements: a dot at the pointer and a larger ring that lagged
 * behind it and changed size over links, cards, images and text. That is a
 * well-worn portfolio effect and it was well built, but it kept drawing
 * attention to itself — the caret state in particular read as a text cursor
 * stuck in the middle of the hero headline.
 *
 * So it is one dot now. No trailing element, no lag, no size changes, no
 * per-element states. The whole state machine is gone rather than disabled,
 * because a feature nobody wants is not worth the branch it costs to switch off.
 *
 * NO GSAP, AND NO ANIMATION LOOP
 * The old version drove position through `gsap.quickTo`, which existed to
 * create the lag. With the lag gone the right implementation is the simplest
 * one: write the transform in the event handler. Browsers already coalesce
 * `pointermove` to roughly one event per frame, so this is one style write per
 * frame with no tween, no ticker and no rAF loop running while the page sits
 * idle.
 *
 * `translate3d` rather than `left`/`top` — the transform is composited, so
 * moving the dot never triggers layout.
 *
 * NOT REACT STATE
 * Position is written straight to the DOM. A pointermove fires up to 120 times
 * a second, and putting that in state would re-render this component and
 * everything below it at the same rate.
 *
 * DISABLED WHEN
 *   - The pointer is coarse. A touch device has no hover position, so the dot
 *     would sit frozen wherever the last tap landed.
 *   - Motion is reduced. An element that follows the pointer is continuous
 *     motion by definition.
 *
 * In both cases this renders nothing *and* never hides the native cursor — the
 * `data-cursor` attribute that does that is only set once this is actually
 * running, so a failure can never leave a visitor with no pointer at all.
 */
export function Cursor() {
  const dotRef = useRef(null)
  const [visible, setVisible] = useState(false)

  const isFinePointer = useMediaQuery('(pointer: fine)')
  const prefersReducedMotion = usePrefersReducedMotion()
  const enabled = isFinePointer && !prefersReducedMotion

  // Hide the native cursor only while ours is live.
  useEffect(() => {
    if (!enabled) return

    document.documentElement.dataset.cursor = 'custom'
    return () => {
      delete document.documentElement.dataset.cursor
    }
  }, [enabled])

  useEffect(() => {
    if (!enabled) return

    const dot = dotRef.current
    if (!dot) return

    const handleMove = (event) => {
      dot.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`
      setVisible(true)
    }

    // Leaving the document entirely — the pointer is over browser chrome or
    // another window, and a dot frozen at the edge of the page looks broken.
    const handleLeave = () => setVisible(false)
    const handleEnter = () => setVisible(true)

    window.addEventListener('pointermove', handleMove, { passive: true })
    document.addEventListener('pointerleave', handleLeave)
    document.addEventListener('pointerenter', handleEnter)

    return () => {
      window.removeEventListener('pointermove', handleMove)
      document.removeEventListener('pointerleave', handleLeave)
      document.removeEventListener('pointerenter', handleEnter)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div
      // Decorative in the strictest sense: it duplicates a pointer the OS
      // already provides, and conveys nothing to a screen reader.
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-cursor overflow-hidden"
    >
      {/*
        The outer span is positioned by the transform above and carries nothing
        else. The inner span owns the appearance and the centring offset, so the
        per-frame write and the styling never touch the same property — a
        `scale-*` utility here would be a `transform`, and the two would
        overwrite each other every frame.
      */}
      <span ref={dotRef} className="absolute top-0 left-0">
        <span
          className={cn(
            'block size-2 -mt-1 -ml-1 rounded-full bg-ink',
            'transition-opacity duration-fast ease-out-quart',
            !visible && 'opacity-0',
          )}
        />
      </span>
    </div>
  )
}
