import { useRef, useState } from 'react'
import { useLenis } from 'lenis/react'

/**
 * Track scroll direction and position — the state a sticky header needs.
 *
 * Driven by Lenis's own scroll event rather than a `window` listener: Lenis
 * emits once per animation frame with the smoothed value, so there is no
 * throttling to tune and no listener firing on frames where nothing moved.
 *
 * @param {object} [options]
 * @param {number} [options.threshold=8] Minimum px of travel before direction
 *   flips. Prevents jitter from trackpad micro-scrolls.
 * @param {number} [options.topOffset=24] Px from the top below which `atTop`
 *   stays true.
 * @returns {{ direction: 'up'|'down', scrollY: number, atTop: boolean }}
 *
 * @example
 * const { direction, atTop } = useScrollDirection()
 * <header className={cn(direction === 'down' && !atTop && '-translate-y-full')} />
 */
export function useScrollDirection({ threshold = 8, topOffset = 24 } = {}) {
  const [state, setState] = useState({ direction: 'up', scrollY: 0, atTop: true })
  const lastY = useRef(0)

  useLenis(({ scroll }) => {
    const y = Math.max(0, scroll)
    const delta = y - lastY.current

    // Ignore sub-threshold movement so the direction does not thrash, but keep
    // reporting position so `atTop` stays accurate.
    if (Math.abs(delta) < threshold) {
      setState((prev) =>
        prev.scrollY === y && prev.atTop === y <= topOffset
          ? prev
          : { ...prev, scrollY: y, atTop: y <= topOffset },
      )
      return
    }

    lastY.current = y
    setState({
      direction: delta > 0 ? 'down' : 'up',
      scrollY: y,
      atTop: y <= topOffset,
    })
  })

  return state
}
