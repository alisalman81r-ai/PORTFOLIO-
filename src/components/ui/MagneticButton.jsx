import { useEffect, useRef } from 'react'

import { gsap } from '@/animations'
import { usePrefersReducedMotion } from '@/hooks'

/**
 * Wraps a control so it drifts toward the cursor on hover.
 *
 * The effect that makes a button feel physically present rather than painted
 * on. Kept subtle: the element should appear to *lean*, never to chase.
 *
 * WHY `useEffect` AND NOT `useGSAP`
 * ---------------------------------
 * `useGSAP` ignores a cleanup function returned from its callback — it only
 * reverts its own GSAP context on unmount. Listeners registered inside it would
 * never be removed. The tween is cleaned up explicitly here instead.
 *
 * WHY `gsap.quickTo`
 * ------------------
 * `quickTo` reuses one tween instance and just retargets it, so a pointermove
 * firing 120×/second costs one property write rather than 120 new tweens. It
 * also interpolates *toward* the new value, which is what produces the trailing
 * ease instead of a rigid 1:1 follow.
 *
 * DISABLED WHEN: the pointer is coarse (a touch device has no hover position,
 * so the effect would only fire on tap) or motion is reduced.
 *
 * @param {object} props
 * @param {React.ElementType} [props.as='button'] Render as `a` for links.
 * @param {number} [props.strength=0.32] Fraction of cursor offset to follow.
 *   Above ~0.5 the element detaches from its label and reads as broken.
 * @param {number} [props.damping=0.55] Seconds for the element to catch up.
 * @param {string} [props.className]
 * @param {React.ReactNode} props.children
 *
 * @example
 * <MagneticButton as="a" href="#projects" className="btn btn-primary btn-lg">
 *   View projects
 * </MagneticButton>
 */
export function MagneticButton({
  as: Component = 'button',
  strength = 0.32,
  damping = 0.55,
  className,
  children,
  ...rest
}) {
  const ref = useRef(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const element = ref.current
    if (!element || prefersReducedMotion) return
    if (!window.matchMedia('(pointer: fine)').matches) return

    const moveX = gsap.quickTo(element, 'x', { duration: damping, ease: 'power3.out' })
    const moveY = gsap.quickTo(element, 'y', { duration: damping, ease: 'power3.out' })

    const handleMove = (event) => {
      const { left, top, width, height } = element.getBoundingClientRect()
      moveX((event.clientX - (left + width / 2)) * strength)
      moveY((event.clientY - (top + height / 2)) * strength)
    }

    const handleLeave = () => {
      moveX(0)
      moveY(0)
    }

    element.addEventListener('pointermove', handleMove)
    element.addEventListener('pointerleave', handleLeave)

    return () => {
      element.removeEventListener('pointermove', handleMove)
      element.removeEventListener('pointerleave', handleLeave)
      // Kill the tween and reset, so a re-mount never inherits an offset.
      gsap.killTweensOf(element)
      gsap.set(element, { x: 0, y: 0 })
    }
  }, [strength, damping, prefersReducedMotion])

  return (
    <Component ref={ref} className={className} {...rest}>
      {children}
    </Component>
  )
}
