import { useRef } from 'react'

import { createParallax, useGSAP } from '@/animations'
import { cn } from '@/utils'

/**
 * Move its children at a different rate than the page as they scroll past.
 *
 * Wraps the `createParallax` factory so a section can opt into depth without
 * touching GSAP directly.
 *
 * `useGSAP` with a `scope` is what makes this safe in React: every tween and
 * ScrollTrigger created inside the callback is registered to this component and
 * reverted on unmount. Without it, StrictMode's double-mount in development
 * leaves a second, orphaned ScrollTrigger attached to a detached DOM node —
 * which shows up as motion that gets faster on every hot reload.
 *
 * PERFORMANCE: this animates `transform` only, which the compositor handles
 * without layout or paint. Add `className="gpu"` if the layer promotion helps,
 * but measure first — a permanent `will-change` on many elements costs more
 * GPU memory than it saves.
 *
 * @param {object} props
 * @param {React.ElementType} [props.as='div']
 * @param {number} [props.speed=0.2] Travel as a fraction of scroll distance.
 *   Keep it subtle: above ~0.4 it reads as a rendering bug rather than depth.
 *   Negative values move against the scroll.
 * @param {'x'|'y'} [props.axis='y']
 * @param {string} [props.className]
 * @param {React.ReactNode} props.children
 *
 * @example
 * // Scale the image so its edges never enter the frame at travel extremes.
 * <div className="overflow-hidden rounded-card">
 *   <Parallax speed={0.25}>
 *     <img src={cover} alt="" className="scale-125" />
 *   </Parallax>
 * </div>
 */
export function Parallax({
  as: Component = 'div',
  speed = 0.2,
  axis = 'y',
  className,
  children,
  ...rest
}) {
  const ref = useRef(null)

  useGSAP(
    () => {
      createParallax(ref.current, { speed, axis })
    },
    // Re-create the tween when the inputs change; useGSAP reverts the old one.
    { scope: ref, dependencies: [speed, axis] },
  )

  return (
    <Component ref={ref} className={cn('will-change-transform', className)} {...rest}>
      {children}
    </Component>
  )
}
