import { Link } from 'react-router-dom'
import { motion } from 'motion/react'

import { Seo } from '@/components/shared'
import { Section } from '@/layouts'
import { GlowOrb, Icon, MagneticButton } from '@/components/ui'
import { DURATION, EASE, STAGGER } from '@/animations'
import { FOOTER_LINKS } from '@/data'

const content = {
  hidden: {},
  visible: { transition: { staggerChildren: STAGGER.base, delayChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION.slow, ease: EASE.outExpo } },
}

/**
 * 404 page.
 *
 * THE ILLUSTRATION IS CSS, NOT AN ASSET
 * Three concentric rings, a drifting glow, and the numerals themselves — all
 * DOM. That keeps it theme-aware, resolution-independent, weightless, and
 * impossible to mistake for a stock graphic. It also means the one page nobody
 * plans to visit costs no extra bytes to ship.
 *
 * The rings counter-rotate at different speeds, so the pair never returns to
 * the same relative position and the composition never reads as a loop. Both
 * are the same `ring-conic` utility the hero and portrait frames use, so the
 * page belongs to the same visual family rather than inventing a look for
 * itself.
 *
 * The `404` is rendered as decorative text (`aria-hidden`) with the real
 * message in the heading beneath it — a screen reader gets "Page not found",
 * not a number read as an ordinal.
 *
 * A 404 that offers only "go home" makes the visitor start over. The section
 * links give them somewhere useful to land instead, since a bad URL is usually
 * a stale link rather than a lost visitor.
 */
export default function NotFound() {
  return (
    <>
      {/* `noindex` regardless of the site setting: an error page has no
          business in a search result. */}
      <Seo title="Page not found" noindex />

      <Section
        id="not-found"
        labelledBy="not-found-title"
        spacing="none"
        className="relative grid min-h-svh place-items-center overflow-x-clip py-32"
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <GlowOrb
            tone="warm"
            motion="drift"
            className="top-[10%] left-1/2 size-[70vw] max-w-[820px] -translate-x-1/2"
          />
          <GlowOrb
            tone="cool"
            motion="drift-slow"
            className="right-[10%] bottom-[5%] size-[45vw] max-w-[520px]"
          />
        </div>

        <motion.div
          variants={content}
          initial="hidden"
          animate="visible"
          className="relative flex flex-col items-center text-center"
        >
          {/* ── Illustration ──────────────────────────────────────────────── */}
          <motion.div variants={item} className="relative grid place-items-center">
            <span
              aria-hidden="true"
              className="ring-conic absolute size-64 animate-spin-slower rounded-full opacity-70 sm:size-80"
            />
            <span
              aria-hidden="true"
              className="ring-conic absolute size-48 animate-spin-slow rounded-full opacity-40 [animation-direction:reverse] sm:size-56"
            />
            <span
              aria-hidden="true"
              className="absolute size-32 rounded-full border border-line sm:size-40"
            />

            {/*
              `heading-xl`, NOT `text-display-xl`.

              `cn()` runs tailwind-merge, which resolves conflicting utilities by
              prefix — and it groups `text-display-xl` (a size) with
              `text-gradient` (our custom utility) because both start with
              `text-`. The last one wins, so the size class was being stripped
              silently and the numeral rendered at the inherited 16px. No error,
              no warning: the class simply was not in the DOM.

              `heading-xl` sets the same size but is not `text-`-prefixed, so
              tailwind-merge leaves both alone. Worth remembering for any future
              pairing of `text-gradient` with a size.
            */}
            <p aria-hidden="true" className="relative heading-xl text-gradient tabular-nums">
              404
            </p>
          </motion.div>

          {/* ── Message ───────────────────────────────────────────────────── */}
          <motion.p variants={item} className="eyebrow mt-14 flex text-faint">
            Error 404
          </motion.p>

          <motion.h1 variants={item} id="not-found-title" className="heading-md mt-5 text-ink">
            This page took a wrong turn
          </motion.h1>

          <motion.p variants={item} className="lead mx-auto mt-5 max-w-prose">
            The link is broken, or the page has moved. Nothing here is lost — the
            work is all one scroll away.
          </motion.p>

          {/* ── Actions ───────────────────────────────────────────────────── */}
          <motion.div
            variants={item}
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
          >
            <MagneticButton as={Link} to="/" className="btn btn-primary group/cta">
              <Icon
                name="prev"
                className="size-4 transition-transform duration-base ease-out-expo group-hover/cta:-translate-x-0.5"
              />
              Back to home
            </MagneticButton>
          </motion.div>

          {/* ── Shortcuts ─────────────────────────────────────────────────── */}
          <motion.nav variants={item} aria-label="Site sections" className="mt-12">
            <h2 className="eyebrow flex justify-center text-faint">Or jump straight to</h2>

            <ul className="mt-4 flex flex-wrap items-center justify-center gap-2">
              {FOOTER_LINKS.map((link) => (
                <li key={link.id}>
                  {/* Route to `/` carrying the hash. The section lives on the
                      home page, so linking to the bare anchor from a 404 would
                      target an element that is not in this document. */}
                  <Link to={`/${link.href}`} className="btn btn-outline btn-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>
        </motion.div>
      </Section>
    </>
  )
}
