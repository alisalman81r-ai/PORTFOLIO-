import { useRef } from 'react'

import { useLenis } from '@/hooks'
import { cn } from '@/utils'

/**
 * Reading-progress bar across the top of the viewport.
 *
 * WRITES TO THE DOM, NEVER TO STATE
 * Lenis emits a scroll event every animation frame. Holding progress in
 * `useState` would re-render this component — and re-run every hook in it —
 * sixty times a second for the entire life of the page. Writing `scaleX`
 * straight onto a ref costs one property assignment and no React work at all.
 *
 * `scaleX` on a two-pixel bar is compositor-only: no layout, no paint, no
 * matter how tall the document is.
 *
 * Lenis already exposes `progress` (0–1), so nothing here reads `scrollHeight`
 * — which would force a synchronous layout calculation every frame.
 *
 * Decorative: the scrollbar conveys the same thing, and a duplicate is noise
 * for a screen-reader user.
 */
export function ScrollProgress({ className }) {
  const barRef = useRef(null)

  useLenis(({ progress }) => {
    const bar = barRef.current
    if (!bar) return

    // Guards a page shorter than the viewport, where the scroll limit is 0 and
    // the division producing `progress` yields NaN.
    const value = Number.isFinite(progress) ? Math.min(Math.max(progress, 0), 1) : 0
    bar.style.transform = `scaleX(${value})`
  })

  return (
    <div
      aria-hidden="true"
      className={cn('pointer-events-none fixed inset-x-0 top-0 z-drawer h-0.5', className)}
    >
      <span
        ref={barRef}
        className="block h-full origin-left scale-x-0 bg-gradient-to-r from-accent to-accent-alt"
      />
    </div>
  )
}
