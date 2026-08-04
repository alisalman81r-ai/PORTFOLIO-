import { motion } from 'motion/react'
import { Atom, Gauge, Sparkles } from 'lucide-react'

import { TiltCard } from '@/components/ui'
import { DURATION, EASE } from '@/animations'
import { HERO } from '@/data'
import { cn } from '@/utils'

/** Icons referenced by string key in `data/hero.js`, resolved here. */
const CHIP_ICONS = { atom: Atom, sparkles: Sparkles, gauge: Gauge }

/**
 * Widths of the abstract "code" lines, as Tailwind fractions.
 *
 * Deliberately uneven and non-repeating — evenly-stepped bars read as a loading
 * skeleton, while a ragged right edge reads as written text. The eye recognises
 * the rhythm of code without a single character being rendered.
 */
const CODE_LINES = [
  { width: 'w-5/12', tone: 'bg-accent/60' },
  { width: 'w-9/12', tone: 'bg-ink/25' },
  { width: 'w-7/12', tone: 'bg-ink/25' },
  { width: 'w-10/12', tone: 'bg-accent-alt/45' },
  { width: 'w-4/12', tone: 'bg-ink/20' },
  { width: 'w-8/12', tone: 'bg-ink/25' },
  { width: 'w-6/12', tone: 'bg-accent/40' },
]

/** Floating chip positions. Off-grid on purpose — symmetry reads as a diagram. */
const CHIP_POSITIONS = [
  '-left-4 top-[18%] sm:-left-8',
  '-right-2 top-[42%] sm:-right-6',
  // Straddles the bottom edge rather than sitting inside it — placed within
  // the card it collides with the status row and reads as a layout bug.
  '-bottom-5 left-[14%]',
]

/**
 * Abstract developer-themed composition for the hero's right column.
 *
 * No stock imagery and no photographs — the entire visual is CSS and SVG-free
 * DOM, which means it is theme-aware, resolution-independent, weighs nothing,
 * and cannot look like a template someone else also bought.
 *
 * WHAT IT DEPICTS
 * An editor pane rendered as pure abstraction: window chrome, ragged lines of
 * "code" as gradient bars, a status row. Recognisably a developer's surface
 * without fabricating any code, output, or metric.
 *
 * COMPOSITION
 * A rotating conic ring sits behind the card and a second counter-rotates,
 * which is what keeps the arrangement alive when nothing is being hovered.
 * Three glass chips float at uneven offsets to break the rectangle.
 *
 * The whole card tilts toward the cursor via `TiltCard`, with a glare that
 * tracks the pointer — the interaction that makes it read as an object under
 * light rather than a flat panel.
 */
export function HeroVisual({ className }) {
  return (
    <div className={cn('relative mx-auto w-full max-w-[34rem]', className)}>
      {/* Rotating rings. Counter-rotation at different speeds means the pair
          never returns to the same relative position, so the motion never
          reads as a loop. */}
      <div
        aria-hidden="true"
        className="ring-conic absolute inset-[-12%] animate-spin-slower rounded-full opacity-70"
      />
      <div
        aria-hidden="true"
        className="ring-conic absolute inset-[4%] animate-spin-slow rounded-full opacity-40 [animation-direction:reverse]"
      />

      <TiltCard
        intensity={8}
        className="card card-glass card-panel relative rounded-panel shadow-floating"
      >
        {/* Window chrome */}
        <div className="flex items-center gap-3 border-b border-line pb-4">
          <span aria-hidden="true" className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-negative/70" />
            <span className="size-2.5 rounded-full bg-warning/70" />
            <span className="size-2.5 rounded-full bg-positive/70" />
          </span>

          <span className="font-mono text-xs text-faint">~/portfolio</span>

          <span className="eyebrow ml-auto text-[0.625rem] text-faint">live</span>
        </div>

        {/* Abstract code body. Each line wipes in from the left on a stagger,
            which mimics text being typed without any character animation. */}
        <ul className="mt-6 flex flex-col gap-3">
          {CODE_LINES.map((line, index) => (
            <li key={index} className="flex items-center gap-4">
              <span
                aria-hidden="true"
                className="w-4 shrink-0 text-right font-mono text-[0.625rem] text-faint/60"
              >
                {index + 1}
              </span>

              <motion.span
                aria-hidden="true"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  duration: DURATION.slow,
                  ease: EASE.outExpo,
                  delay: 0.6 + index * 0.08,
                }}
                className={cn('h-2 origin-left rounded-pill', line.width, line.tone)}
              />
            </li>
          ))}
        </ul>

        {/* Status row */}
        <div className="mt-8 flex items-center justify-between border-t border-line pt-5">
          <span className="eyebrow text-[0.625rem]">Build</span>
          <span className="flex items-center gap-2 font-mono text-xs text-muted">
            <span
              aria-hidden="true"
              className="size-1.5 animate-pulse-soft rounded-full bg-positive"
            />
            passing
          </span>
        </div>
      </TiltCard>

      {/* Floating chips. Positioned outside the card so they break its silhouette
          — a composition contained inside one rectangle reads as a screenshot. */}
      {HERO.chips.map((chip, index) => {
        const Icon = CHIP_ICONS[chip.icon]

        return (
          <motion.div
            key={chip.id}
            aria-hidden="true"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: DURATION.slow,
              ease: EASE.outExpo,
              delay: 1 + index * 0.12,
            }}
            className={cn('absolute z-raised', CHIP_POSITIONS[index])}
          >
            {/* Float lives on an inner element so the entrance transform and the
                looping transform never fight over the same property. */}
            <span
              className={cn(
                'glass flex animate-float items-center gap-2 rounded-pill px-3 py-2',
                'shadow-lifted',
                // Offset each chip's float so they bob independently.
                index === 1 && '[animation-delay:-2s]',
                index === 2 && '[animation-delay:-4s]',
              )}
            >
              {Icon && <Icon className="size-3.5 text-accent" />}
              <span className="font-mono text-xs text-ink">{chip.label}</span>
            </span>
          </motion.div>
        )
      })}
    </div>
  )
}
