import { motion } from 'motion/react'

import { GlowBorder, GlowOrb, Icon, ImageFrame } from '@/components/ui'
import { DURATION, EASE } from '@/animations'
import { ABOUT, PERSONAL } from '@/data'
import { cn } from '@/utils'

/** Chip offsets. Uneven on purpose — symmetry reads as a diagram, not a composition. */
// Tighter insets on small screens — at 390px the wider desktop offset puts a
// chip within a few pixels of the viewport edge, which reads as an accident.
const CHIP_POSITIONS = ['-left-2 top-[14%] sm:-left-8', '-right-2 bottom-[16%] sm:-right-7']

/**
 * Left column of the About section: the portrait and its surrounding
 * decoration.
 *
 * LAYER ORDER, back to front
 *   1. Two counter-drifting glow orbs — separate the column from the canvas.
 *   2. The floating frame: an animated gradient border around the image.
 *   3. Glass chips straddling the edges, breaking the rectangle.
 *
 * The float is a CSS keyframe (`animate-float`), not a Motion loop. A JS
 * animation running for the lifetime of the page costs a callback every frame
 * for something the compositor can own outright — and it freezes correctly
 * under `prefers-reduced-motion` via `base.css` with no extra code.
 *
 * The chips animate in with Motion because that is a one-shot entrance tied to
 * scroll position, which CSS cannot express.
 */
export function AboutPortrait({ className }) {
  return (
    <div className={cn('relative mx-auto w-full max-w-sm lg:max-w-md', className)}>
      <GlowOrb
        tone="cool"
        motion="drift"
        className="-top-[18%] -left-[22%] size-[80%]"
      />
      <GlowOrb
        tone="warm"
        motion="drift-slow"
        className="-right-[18%] -bottom-[18%] size-[70%]"
      />

      {/* Float on a wrapper so the drift never competes with the entrance
          transform on the frame itself — two animations writing `transform` on
          one element means the last one wins and the other silently vanishes. */}
      <div className="animate-float">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: DURATION.slower, ease: EASE.outExpo }}
        >
          <GlowBorder radius="panel" speed="slower" className="shadow-floating">
            <ImageFrame
              src={PERSONAL.avatar}
              alt={PERSONAL.name ? `Portrait of ${PERSONAL.name}` : ''}
              ratio="portrait"
              className="rounded-panel"
            >
              {/* Grounds the image against the frame and gives any future
                  overlay text something to sit on. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-canvas/70 to-transparent"
              />
            </ImageFrame>
          </GlowBorder>
        </motion.div>
      </div>

      {ABOUT.portraitChips.map((chip, index) => (
        <motion.div
          key={chip.id}
          aria-hidden="true"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: DURATION.slow, ease: EASE.outExpo, delay: 0.35 + index * 0.12 }}
          className={cn('absolute z-raised', CHIP_POSITIONS[index])}
        >
          <span
            className={cn(
              'glass flex animate-float items-center gap-2 rounded-pill px-3 py-2 shadow-lifted',
              // Offset the second chip's cycle so the pair never bobs in unison.
              index === 1 && '[animation-delay:-3s]',
            )}
          >
            <Icon name={chip.icon} className="size-3.5 text-accent" />
            <span className="font-mono text-xs text-ink">{chip.label}</span>
          </span>
        </motion.div>
      ))}
    </div>
  )
}
