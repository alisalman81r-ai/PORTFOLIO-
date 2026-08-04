import { useRef } from 'react'
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from 'motion/react'

import { SPRING } from '@/animations'
import { cn } from '@/utils'
import { usePrefersReducedMotion } from '@/hooks'

/**
 * Card that tilts in 3D toward the cursor, with a glare that tracks it.
 *
 * WHY MOTION VALUES AND NOT STATE
 * -------------------------------
 * Pointer position is stored in `useMotionValue`, which writes straight to the
 * DOM outside React's render cycle. Holding it in `useState` would re-render
 * this subtree on every pointermove — up to 120×/second — and no amount of
 * memoisation downstream would make that smooth.
 *
 * The springs are what sell it: the raw pointer value snaps, and a spring gives
 * the card weight, including the settle when the cursor leaves.
 *
 * `transformPerspective` is set on the card rather than as a `perspective` on
 * the parent so the component is self-contained and its tilt does not depend on
 * whatever wrapper it happens to be dropped into.
 *
 * Note: `style` here carries *motion values*, not static styling. That is how
 * Motion binds animated transforms to the DOM — the visual design still lives
 * entirely in classes.
 *
 * @param {object} props
 * @param {number} [props.intensity=9] Maximum rotation in degrees. Above ~14 the
 *   perspective distortion becomes obvious and it stops looking like a card.
 * @param {boolean} [props.glare=true] Render the pointer-tracking sheen.
 * @param {string} [props.className]
 * @param {React.ReactNode} props.children
 */
export function TiltCard({ intensity = 9, glare = true, className, children, ...rest }) {
  const ref = useRef(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  // Normalised pointer position within the card, -0.5 → 0.5 on both axes.
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)

  const rotateX = useSpring(
    useTransform(pointerY, [-0.5, 0.5], [intensity, -intensity]),
    SPRING.soft,
  )
  const rotateY = useSpring(
    useTransform(pointerX, [-0.5, 0.5], [-intensity, intensity]),
    SPRING.soft,
  )

  // Glare position, expressed as a percentage for the radial gradient.
  const glareX = useTransform(pointerX, [-0.5, 0.5], ['0%', '100%'])
  const glareY = useTransform(pointerY, [-0.5, 0.5], ['0%', '100%'])
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, oklch(1 0 0 / 0.1), transparent 55%)`

  const handleMove = (event) => {
    const element = ref.current
    if (!element || prefersReducedMotion) return

    const { left, top, width, height } = element.getBoundingClientRect()
    pointerX.set((event.clientX - left) / width - 0.5)
    pointerY.set((event.clientY - top) / height - 0.5)
  }

  const handleLeave = () => {
    pointerX.set(0)
    pointerY.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      className={cn('relative transform-3d', className)}
      {...rest}
    >
      {children}

      {glare && !prefersReducedMotion && (
        <motion.span
          aria-hidden="true"
          style={{ backgroundImage: glareBackground }}
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
        />
      )}
    </motion.div>
  )
}
