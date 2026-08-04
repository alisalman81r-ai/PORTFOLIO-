import { motion } from 'motion/react'
import { ArrowDown, ArrowRight, Mail } from 'lucide-react'

import { HeroBackground } from './HeroBackground'
import { HeroVisual } from './HeroVisual'
import { Section } from '@/layouts'
import { TextReveal } from '@/components/animations'
import { MagneticButton, RotatingText } from '@/components/ui'
import { DURATION, EASE, STAGGER } from '@/animations'
import { HERO, PERSONAL } from '@/data'
import { cn } from '@/utils'

const CTA_ICONS = { arrow: ArrowRight, mail: Mail }

/**
 * Entrance choreography.
 *
 * One parent orchestrates the whole left column rather than each element
 * carrying its own delay. Adding or reordering a child then re-times the
 * sequence automatically — hand-tuned delays drift out of sync the first time
 * anything moves.
 *
 * `delayChildren` holds the sequence back briefly so the background gradients
 * establish the space before content arrives on top of it.
 */
const content = {
  hidden: {},
  visible: {
    transition: { staggerChildren: STAGGER.base, delayChildren: 0.15 },
  },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.slow, ease: EASE.outExpo },
  },
}

/**
 * Hero section.
 *
 * LAYOUT
 * A 12-column grid at `lg` and above: content on 6, visual on 6 with a column
 * of air between. Below `lg` it becomes a single column and the visual moves
 * *under* the copy — on a phone the headline and CTA must be reachable without
 * scrolling past decoration.
 *
 * `min-h-svh` rather than `min-h-screen`: `svh` is the *small* viewport height,
 * which excludes mobile browser chrome. `100vh` on iOS Safari is taller than
 * the visible area, so a full-height hero pushes its own CTA below the fold.
 *
 * The section owns no spacing of its own (`spacing="none"`) because it is
 * viewport-height and pads itself around the fixed header.
 */
export function Hero() {
  return (
    <Section
      id="home"
      spacing="none"
      container={false}
      labelledBy="hero-title"
      className="relative flex min-h-svh items-center overflow-hidden"
    >
      <HeroBackground />

      {/* Padding is tuned so the primary CTA clears the fold on a 900px-tall
          laptop — the most common desktop viewport. A hero whose call to action
          sits below the fold has failed at the one job it has. */}
      <div className="container-page relative grid w-full items-center gap-16 pt-28 pb-20 lg:grid-cols-12 lg:gap-8 lg:pt-32 lg:pb-24">
        {/* ── Content ──────────────────────────────────────────────────── */}
        <motion.div
          variants={content}
          initial="hidden"
          animate="visible"
          className="lg:col-span-6 xl:col-span-6"
        >
          {/* Availability badge */}
          {HERO.badge.active && (
            // `flex w-fit` overrides `eyebrow`'s inline-flex so the badge is a
            // block-level pill that shrink-wraps, instead of sharing a line
            // with the name below it.
            <motion.p
              variants={item}
              className="eyebrow glass mb-8 flex w-fit rounded-pill px-3 py-2"
            >
              <span aria-hidden="true" className="relative flex size-2">
                {/* Two-layer dot: a static core plus an expanding halo. A single
                    pulsing dot reads as a loading state; the halo reads as a
                    live signal. */}
                <span className="absolute inset-0 animate-ping rounded-full bg-positive opacity-60" />
                <span className="relative size-2 rounded-full bg-positive" />
              </span>
              {HERO.badge.label}
            </motion.p>
          )}

          {/* Name — small, above the statement. The headline is the pitch; the
              name is the signature. */}
          <motion.p variants={item} className="eyebrow mb-5 flex text-muted">
            {PERSONAL.name}
          </motion.p>

          <h1 id="hero-title" className="heading-lg text-ink">
            {HERO.headline.map((line, index) => (
              <span key={line.text} className="block">
                <TextReveal
                  text={line.text}
                  delay={0.35 + index * 0.12}
                  className={cn(line.accent && 'accent-serif')}
                  // The gradient goes on the word, not the wrapper. Each word
                  // is transformed for the reveal, and a transform on a
                  // descendant of a `background-clip: text` element promotes it
                  // to its own layer — the clipped background does not follow,
                  // and the text renders invisible. Putting both on the same
                  // element avoids that entirely.
                  wordClassName={cn(line.accent && 'text-gradient pr-[0.08em]')}
                />
              </span>
            ))}
          </h1>

          {/* Animated subtitle */}
          <motion.p
            variants={item}
            className="mt-7 flex flex-wrap items-baseline gap-x-2 text-body-lg text-muted"
          >
            {HERO.subtitlePrefix}
            <RotatingText items={HERO.subtitleRotating} className="font-medium text-accent" />
          </motion.p>

          <motion.p variants={item} className="lead mt-6 max-w-prose">
            {HERO.description}
          </motion.p>

          {/* CTAs */}
          <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-3">
            {HERO.ctas.map((cta) => {
              const Icon = CTA_ICONS[cta.icon]

              return (
                <MagneticButton
                  key={cta.href}
                  as="a"
                  href={cta.href}
                  className={cn(
                    'btn btn-lg group',
                    cta.variant === 'primary' ? 'btn-primary hover-glow' : 'btn-outline',
                  )}
                >
                  {cta.label}
                  {Icon && (
                    <Icon
                      aria-hidden="true"
                      className="size-4 transition-transform duration-base ease-out-expo group-hover:translate-x-1"
                    />
                  )}
                </MagneticButton>
              )
            })}
          </motion.div>
        </motion.div>

        {/* ── Visual ───────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: DURATION.slower, ease: EASE.outExpo, delay: 0.3 }}
          className="lg:col-span-6 xl:col-span-5 xl:col-start-8"
        >
          <HeroVisual />
        </motion.div>
      </div>

      {/* Scroll cue. Hidden on short viewports, where it would overlap the CTAs
          rather than sit below them. */}
      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: DURATION.slow, delay: 1.4 }}
        aria-label="Scroll to next section"
        className={cn(
          'absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2',
          'text-faint transition-colors duration-fast hover:text-ink',
          'lg:flex',
        )}
      >
        <span className="eyebrow text-[0.625rem]">Scroll</span>
        <ArrowDown aria-hidden="true" className="size-4 animate-float" />
      </motion.a>
    </Section>
  )
}
