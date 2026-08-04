import { motion } from 'motion/react'

import { fadeInUp, VIEWPORT } from '@/animations'

/**
 * Animate an element in the first time it scrolls into view.
 *
 * The single most-used animation on a portfolio, so it is a component rather
 * than a copy-pasted `<motion.div initial=… whileInView=…>` in fifty places.
 * Centralising it means the reveal *feel* is one decision.
 *
 * `once: true` by default — re-animating every time an element scrolls back
 * into view is the clearest tell of an amateur build, and it makes the page
 * feel unstable when scrolling up.
 *
 * Reduced motion is handled globally by `<MotionConfig reducedMotion="user">`
 * in `context/AppProviders.jsx`: transform and layout animation is suppressed
 * while opacity still fades, so content appears without movement.
 *
 * @param {object} props
 * @param {React.ElementType} [props.as='div'] Tag to render. Use a semantic
 *   element rather than wrapping one in an extra div.
 * @param {object} [props.variants=fadeInUp] Motion variants with `hidden` and
 *   `visible` states. Pass any variant from `@/animations`.
 * @param {number} [props.delay=0] Seconds to wait before animating.
 * @param {number} [props.amount] Fraction of the element that must be visible
 *   to trigger. Defaults to the shared `VIEWPORT` setting (0.25).
 * @param {boolean} [props.once=true] Animate only the first time.
 * @param {string} [props.className]
 * @param {React.ReactNode} props.children
 *
 * @example
 * <Reveal as="section" delay={0.1}>
 *   <h2 className="heading-lg">Selected Work</h2>
 * </Reveal>
 *
 * @example
 * // Any variant works:
 * <Reveal variants={maskReveal}><img src={cover} alt="" /></Reveal>
 */
export function Reveal({
  as = 'div',
  variants = fadeInUp,
  delay = 0,
  amount,
  once = true,
  className,
  children,
  ...rest
}) {
  // `motion` is a proxy, so `motion.div`, `motion.section`, … all resolve.
  const MotionTag = motion[as] ?? motion.div

  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ ...VIEWPORT, once, ...(amount !== undefined && { amount }) }}
      // Delay is applied here rather than inside the variant so the same
      // variant object can be reused at different offsets without cloning it.
      transition={delay ? { delay } : undefined}
      {...rest}
    >
      {children}
    </MotionTag>
  )
}
