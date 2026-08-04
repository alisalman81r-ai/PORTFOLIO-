import { useEffect, useRef, useState } from 'react'

/**
 * Track the pointer position.
 *
 * Groundwork for the custom cursor, magnetic buttons, and spotlight/gradient
 * effects that a premium portfolio is expected to have.
 *
 * TWO MODES, AND THE CHOICE MATTERS
 * ---------------------------------
 * `track: 'ref'` (default) writes coordinates into a ref and re-renders
 * nothing. Read it from inside a rAF loop or a GSAP `quickTo`. This is the
 * right choice for anything that follows the cursor continuously.
 *
 * `track: 'state'` re-renders on every sampled move. Convenient, but a
 * pointermove fires up to 120×/second on a high-refresh display — re-rendering
 * a subtree that often will drop frames. Only use it when the value drives
 * discrete state (a boolean, a quadrant), never a transform.
 *
 * Sampling is throttled to one animation frame either way, so multiple events
 * arriving within a frame collapse into a single update.
 *
 * @param {object} [options]
 * @param {'ref'|'state'} [options.track='ref'] See above.
 * @param {boolean} [options.normalized=false] Also report -1…1 coordinates
 *   relative to the viewport centre — the form most parallax maths wants.
 * @returns {{ position: React.RefObject<{x: number, y: number, nx: number, ny: number}>, x: number, y: number }}
 *   `position` is always live. `x`/`y` only update in 'state' mode.
 *
 * @example
 * // Continuous — no re-renders:
 * const { position } = useMousePosition()
 * useGSAP(() => {
 *   const moveX = gsap.quickTo(cursor.current, 'x', { duration: 0.4, ease: 'power3' })
 *   gsap.ticker.add(() => moveX(position.current.x))
 * })
 */
export function useMousePosition({ track = 'ref', normalized = false } = {}) {
  const position = useRef({ x: 0, y: 0, nx: 0, ny: 0 })
  const [state, setState] = useState({ x: 0, y: 0 })

  const frame = useRef(0)

  useEffect(() => {
    // A coarse pointer means touch: there is no hover position to follow, and
    // listening would fire only on tap. Skip the listener entirely.
    if (!window.matchMedia('(pointer: fine)').matches) return

    const handleMove = (event) => {
      const { clientX, clientY } = event

      // Coalesce to one update per frame. Pointer events can outpace the
      // display, and anything faster than the refresh rate is wasted work.
      if (frame.current) return

      frame.current = requestAnimationFrame(() => {
        frame.current = 0

        position.current.x = clientX
        position.current.y = clientY

        if (normalized) {
          position.current.nx = (clientX / window.innerWidth) * 2 - 1
          position.current.ny = (clientY / window.innerHeight) * 2 - 1
        }

        if (track === 'state') setState({ x: clientX, y: clientY })
      })
    }

    window.addEventListener('pointermove', handleMove, { passive: true })

    return () => {
      window.removeEventListener('pointermove', handleMove)
      if (frame.current) cancelAnimationFrame(frame.current)
    }
  }, [track, normalized])

  return { position, x: state.x, y: state.y }
}
