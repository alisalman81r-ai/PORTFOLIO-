import { motion } from 'motion/react'

import { STAGGER, VIEWPORT, fadeInUp, staggerContainer } from '@/animations'

/**
 * Reveal a group of children one after another.
 *
 * Sequenced entrances read as intentional; simultaneous ones read as a page
 * simply appearing. Use for lists, grids, nav items, and project cards.
 *
 * HOW IT WORKS
 * ------------
 * Motion propagates variant *names* down the tree. The parent declares
 * `initial="hidden"` / `whileInView="visible"`, and every `<StaggerItem>`
 * beneath it resolves those same names against its own variants — so children
 * need no `initial` or `whileInView` of their own. The parent's
 * `staggerChildren` then offsets each one.
 *
 * This is why the pairing matters: `<StaggerItem>` only animates inside a
 * `<Stagger>`. On its own it inherits nothing and stays in its `hidden` state.
 *
 * @param {object} props
 * @param {React.ElementType} [props.as='div']
 * @param {number} [props.stagger=STAGGER.base] Seconds between children. Above
 *   ~0.15 the group stops reading as one gesture and starts feeling slow.
 * @param {number} [props.delayChildren=0] Seconds before the first child.
 * @param {boolean} [props.once=true]
 * @param {string} [props.className]
 * @param {React.ReactNode} props.children
 *
 * @example
 * <Stagger as="ul" className="grid gap-6 md:grid-cols-3">
 *   {projects.map((p) => (
 *     <StaggerItem as="li" key={p.slug}>…</StaggerItem>
 *   ))}
 * </Stagger>
 */
export function Stagger({
  as = 'div',
  stagger = STAGGER.base,
  delayChildren = 0,
  once = true,
  className,
  children,
  ...rest
}) {
  const MotionTag = motion[as] ?? motion.div

  return (
    <MotionTag
      className={className}
      variants={staggerContainer(stagger, delayChildren)}
      initial="hidden"
      whileInView="visible"
      viewport={{ ...VIEWPORT, once }}
      {...rest}
    >
      {children}
    </MotionTag>
  )
}

/**
 * A single item within a `<Stagger>`.
 *
 * Deliberately declares no `initial`/`whileInView` — it inherits the animation
 * state from its parent. Adding them here would make each item trigger on its
 * own viewport intersection and destroy the sequencing.
 *
 * @param {object} props
 * @param {React.ElementType} [props.as='div']
 * @param {object} [props.variants=fadeInUp] Must define `hidden` and `visible`.
 * @param {string} [props.className]
 * @param {React.ReactNode} props.children
 */
export function StaggerItem({
  as = 'div',
  variants = fadeInUp,
  className,
  children,
  ...rest
}) {
  const MotionTag = motion[as] ?? motion.div

  return (
    <MotionTag className={className} variants={variants} {...rest}>
      {children}
    </MotionTag>
  )
}
