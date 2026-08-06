import { useEffect, useRef, useState } from 'react'

import { gsap } from '@/animations'
import { useMediaQuery, usePrefersReducedMotion } from '@/hooks'
import { cn } from '@/utils'

/**
 * Elements that change the cursor's state, in priority order.
 *
 * Resolved with `closest()`, so a label inside a button still reports as a
 * button. Order matters: an `<img>` wrapped in an `<a>` should read as a link,
 * because clicking is what will happen.
 */
const TARGETS = [
  { selector: 'a[href], button, [role="button"], input, textarea, select, label', state: 'action' },
  { selector: '.card, [data-cursor="card"]', state: 'card' },
  { selector: 'img, video, [data-cursor="image"]', state: 'image' },
  // Last, so anything interactive above wins. A heading inside a link should
  // read as a link — clicking is what will happen.
  { selector: 'p, h1, h2, h3, h4, h5, h6, li, blockquote, [data-cursor="text"]', state: 'text' },
]

/**
 * Ring size per state, as a scale class.
 *
 * Scale rather than width: animating width forces a layout pass on every frame
 * of the transition, while scale is composited. Applied to an *inner* element —
 * see the note on the split in the render below.
 */
const RING_SCALE = {
  idle: 'scale-100',
  action: 'scale-[1.9]',
  card: 'scale-[2.6]',
  image: 'scale-[3.2]',
  // Collapses toward an I-beam rather than growing — over copy the cursor
  // should get out of the way, not announce itself. Width is handled
  // separately below.
  text: 'scale-y-[1.6] scale-x-[0.12]',
}

/**
 * Custom cursor: a small dot that tracks the pointer, and a ring that trails it.
 *
 * WHY TWO ELEMENTS
 * The dot lands where the pointer actually is, so precision never suffers. The
 * ring lags slightly and does the expressive work — expanding over interactive
 * things. One element cannot do both: make it precise and it feels lifeless,
 * make it smooth and clicking becomes guesswork.
 *
 * PERFORMANCE — THE WHOLE DESIGN IS ABOUT AVOIDING RE-RENDERS
 * Position is written straight to the DOM by `gsap.quickTo`, which reuses one
 * tween and retargets it rather than creating a new one per event. A pointermove
 * fires up to 120×/second; putting that in React state would re-render this
 * component — and anything below it — at the same rate, and no amount of
 * memoisation downstream would recover it.
 *
 * Only the *state* (idle / action / card / image) lives in React, because it
 * changes when the pointer crosses an element boundary — a few times a second at
 * most, not per frame.
 *
 * DISABLED WHEN
 *   - The pointer is coarse. A touch device has no hover position, so the cursor
 *     would sit frozen wherever the last tap landed.
 *   - Motion is reduced. A trailing element is continuous motion by definition.
 *
 * STATES
 * `action` on anything clickable, `card` and `image` on content surfaces, and
 * `text` over copy — where the ring collapses to a caret and the dot disappears,
 * because over a paragraph the cursor's job is to stay out of the way.
 *
 * In both cases the component renders nothing *and* never hides the native
 * cursor — the `data-cursor` attribute that does that is only set once this is
 * actually running, so a failure can never leave a visitor with no pointer.
 */
export function Cursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const [state, setState] = useState('idle')
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
    const ring = ringRef.current
    if (!dot || !ring) return

    // The dot is nearly instant; the ring trails. That difference is the entire
    // effect — matched durations would render the two as one rigid object.
    const dotX = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3.out' })
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3.out' })
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.5, ease: 'power3.out' })
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.5, ease: 'power3.out' })

    const handleMove = (event) => {
      dotX(event.clientX)
      dotY(event.clientY)
      ringX(event.clientX)
      ringY(event.clientY)
      setVisible(true)
    }

    // State is resolved on `pointerover`, which fires once per element crossed
    // rather than per pixel moved.
    const handleOver = (event) => {
      const target = event.target
      if (!(target instanceof Element)) return

      const match = TARGETS.find((entry) => target.closest(entry.selector))
      setState(match ? match.state : 'idle')
    }

    // Leaving the document entirely — the pointer is over browser chrome or
    // another window, and a cursor frozen at the edge looks broken.
    const handleLeave = () => setVisible(false)
    const handleEnter = () => setVisible(true)

    window.addEventListener('pointermove', handleMove, { passive: true })
    document.addEventListener('pointerover', handleOver, { passive: true })
    document.addEventListener('pointerleave', handleLeave)
    document.addEventListener('pointerenter', handleEnter)

    return () => {
      window.removeEventListener('pointermove', handleMove)
      document.removeEventListener('pointerover', handleOver)
      document.removeEventListener('pointerleave', handleLeave)
      document.removeEventListener('pointerenter', handleEnter)
      gsap.killTweensOf([dot, ring])
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
        THE OUTER/INNER SPLIT IS LOAD-BEARING.

        GSAP writes `transform` on the outer element to position it. Tailwind's
        `scale-*` and `-translate-*` utilities compile to `transform` too — so
        putting either on the same element means GSAP's per-frame write silently
        wipes the class, or vice versa.

        So the outer element is positioned by GSAP and nothing else, and the
        inner element owns every visual transform: its negative margin centres it
        on the pointer, and its scale reacts to state.
      */}
      <span ref={ringRef} className="absolute top-0 left-0">
        <span
          className={cn(
            'block size-8 -mt-4 -ml-4 rounded-full border border-ink/40',
            'transition-[opacity,transform,background-color,border-color] duration-base ease-out-expo',
            RING_SCALE[state] ?? RING_SCALE.idle,
            !visible && 'opacity-0',
            state === 'action' && 'border-accent/70 bg-accent/10',
            state === 'card' && 'border-ink/25',
            state === 'image' && 'border-ink/20 bg-ink/5',
            // As a caret the ring reads better filled and squared off.
            state === 'text' && 'rounded-sm border-transparent bg-ink/50',
          )}
        />
      </span>

      <span ref={dotRef} className="absolute top-0 left-0">
        <span
          className={cn(
            'block size-1.5 -mt-[3px] -ml-[3px] rounded-full bg-ink',
            'transition-[opacity,transform,background-color] duration-fast ease-out-quart',
            !visible && 'opacity-0',
            state === 'action' && 'bg-accent',
            // Over a card or image the dot sits on top of content; shrinking it
            // leaves the ring as the only signal. Over text it would sit in the
            // middle of a glyph, so it goes entirely.
            (state === 'card' || state === 'image') && 'scale-50',
            state === 'text' && 'scale-0',
          )}
        />
      </span>
    </div>
  )
}
