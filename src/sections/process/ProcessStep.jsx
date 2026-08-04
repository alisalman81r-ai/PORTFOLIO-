import { motion } from 'motion/react'

import { Icon } from '@/components/ui'
import { DURATION, EASE, VIEWPORT } from '@/animations'
import { cn } from '@/utils'

const step = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION.slow, ease: EASE.outExpo } },
}

/**
 * Connector variants. Children inherit the parent's `hidden`/`visible` state
 * names, so these run off the step's own scroll trigger with no extra wiring —
 * each segment draws as its step arrives, rather than one line sweeping the row.
 */
const connectorX = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: DURATION.slow, ease: EASE.outExpo, delay: 0.25 },
  },
}

const connectorY = {
  hidden: { scaleY: 0 },
  visible: {
    scaleY: 1,
    transition: { duration: DURATION.slow, ease: EASE.outExpo, delay: 0.25 },
  },
}

/**
 * One step in the working process.
 *
 * THE SPOTLIGHT
 * Hovering any step dims the others, which is what makes four static cards feel
 * interactive. It is driven by state rather than CSS `group-hover` on purpose:
 * the effect needs "dim unless *I* am the hovered one", and expressing that in
 * utilities means two competing `opacity` rules at identical specificity, where
 * only stylesheet source order decides the winner. Four items make the state
 * approach free, and it is unambiguous.
 *
 * The step is not focusable. It performs no action, and putting non-interactive
 * content in the tab order gives keyboard users stops that do nothing — the
 * dimming is a mouse affordance, and nothing is conveyed by it alone.
 *
 * THE CONNECTOR
 * Each step draws the segment to the *next* one, rather than the section
 * drawing a single line across the whole row. A full-width line has no way to
 * know where the last node is: with `flex-1` columns it ends at the container
 * edge, overshooting the final node by most of a column.
 *
 * Anchoring it here makes the geometry exact and self-maintaining — the segment
 * runs from this node's edge into the gap and stops at the next node, and the
 * numbers are the layout's own (`left-14` = node width, `-right-8` = the flex
 * gap, `-bottom-12` = the stacked gap). Add a fifth step and nothing needs
 * recalculating.
 *
 * @param {object} props
 * @param {import('@/data/process').ProcessStep} props.step
 * @param {boolean} props.dimmed Another step is hovered.
 * @param {boolean} props.isLast Suppresses the trailing connector.
 * @param {() => void} props.onHoverStart
 * @param {() => void} props.onHoverEnd
 */
export function ProcessStep({ step: data, dimmed, isLast, onHoverStart, onHoverEnd }) {
  return (
    <motion.li
      variants={step}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      className={cn(
        'group relative flex-1 transition-opacity duration-base ease-out-quart',
        dimmed && 'opacity-45',
      )}
    >
      {!isLast && (
        <>
          {/* Horizontal segment, desktop. `top-7` is the node's centre line
              (56px / 2); `-right-8` reaches across the flex gap to the next node. */}
          <motion.span
            aria-hidden="true"
            variants={connectorX}
            className="absolute top-7 left-14 -right-8 hidden h-px origin-left bg-gradient-to-r from-accent/60 to-accent-alt/25 lg:block"
          />

          {/* Vertical segment, mobile and tablet. `-bottom-12` reaches across
              the stacked gap. */}
          <motion.span
            aria-hidden="true"
            variants={connectorY}
            className="absolute top-14 -bottom-12 left-7 w-px origin-top bg-gradient-to-b from-accent/60 to-accent-alt/25 lg:hidden"
          />
        </>
      )}

      {/* Node. Opaque so the connector appears to pass behind it, and raised
          above the line for the same reason. */}
      <span
        className={cn(
          'relative z-raised grid size-14 place-items-center rounded-full border border-line bg-canvas',
          'transition-colors duration-base ease-out-quart',
          'group-hover:border-accent/50 group-hover:bg-accent-soft',
        )}
      >
        <Icon
          name={data.icon}
          className="size-6 text-muted transition-colors duration-base group-hover:text-accent"
        />
      </span>

      <p aria-hidden="true" className="mt-6 font-mono text-xs text-accent">
        {data.number}
      </p>

      {/* h3: the section heading is h2, so the outline stays continuous. */}
      <h3 className="mt-2 font-display text-lg font-medium text-ink">{data.title}</h3>

      <p className="mt-3 max-w-sm text-body-sm text-muted lg:max-w-none">{data.description}</p>

      <p className="mt-4 flex items-start gap-2 text-body-sm text-faint">
        <Icon name="check" className="mt-1 size-3.5 shrink-0 text-accent" />
        {data.outcome}
      </p>
    </motion.li>
  )
}
