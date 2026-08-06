import { Link } from 'react-router-dom'

import { Section } from '@/layouts'
import { Parallax, TextReveal } from '@/components/animations'
import { GlowOrb, Icon, ImageFrame, MagneticButton, Tag } from '@/components/ui'
import { PROJECT_STATUS } from '@/data'
import { DURATION, EASE } from '@/animations'
import { motion } from 'motion/react'
import { cn } from '@/utils'

/**
 * Section 1 — the hero.
 *
 * The one `<h1>` on the page. Everything below it is an `<h2>`, which keeps the
 * document outline flat and navigable by heading.
 *
 * WHAT GOES ABOVE THE FOLD, AND WHY
 * A recruiter or client landing here has one question: is this worth five
 * minutes. So the fold carries the answer to it — what the project is, what
 * state it is in, what you did, how long it took, and what it was built with —
 * plus the statement, which is the only piece of persuasion on the screen.
 *
 * The metadata is a description list rather than a row of styled divs. Role and
 * timeline are terms with values; marking them up as such means a screen reader
 * announces the pairing instead of reading six disconnected strings.
 *
 * The image gets a slow parallax, matching the hero on the home page. The
 * factory bails out entirely under reduced motion.
 */
export function CaseHero({ study }) {
  const { project, hero, draft } = study
  const status = PROJECT_STATUS[project.status] ?? PROJECT_STATUS.concept
  const ctas = (hero.ctas ?? []).filter((cta) => cta.href)

  const facts = [
    { label: 'Role', value: project.role },
    { label: 'Timeline', value: project.duration },
    { label: 'Year', value: String(project.year) },
    { label: 'Category', value: project.category },
  ].filter((fact) => fact.value)

  return (
    <Section
      as="header"
      id="case-hero"
      spacing="none"
      container={false}
      labelledBy="case-title"
      className="relative overflow-x-clip pt-28 pb-16 lg:pt-36 lg:pb-24"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <GlowOrb
          tone="warm"
          motion="drift"
          className="-top-[30vh] -left-[10vw] size-[70vw] max-w-[900px] lg:size-[45vw]"
        />
        <GlowOrb
          tone="cool"
          motion="drift-slow"
          className="top-[10vh] -right-[15vw] size-[65vw] max-w-[800px] lg:size-[42vw]"
        />
      </div>

      <div className="container-page relative">
        {/* Back to the grid. First in the DOM so it is the first tab stop on the
            page — a reader who arrived here by mistake should not have to pass
            twelve sections to leave. */}
        <Link
          to="/#projects"
          className="eyebrow inline-flex items-center gap-2 text-faint transition-colors duration-fast hover:text-ink"
        >
          <Icon name="prev" className="size-3.5" />
          All projects
        </Link>

        <div className="mt-8 grid gap-12 lg:mt-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <div className="flex flex-wrap items-center gap-2">
              <Tag tone={status.tone}>{status.label}</Tag>
              <Tag tone="outline">{project.category}</Tag>
              {draft && <Tag tone="outline">Draft — content unfinished</Tag>}
            </div>

            <h1 id="case-title" className="heading-lg mt-6 text-ink">
              <TextReveal text={project.title} />
            </h1>

            {hero.statement && (
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: DURATION.slow, ease: EASE.outExpo, delay: 0.35 }}
                className="lead mt-6 max-w-prose"
              >
                {hero.statement}
              </motion.p>
            )}

            {/* Metadata. `dl` because these are term/value pairs, not a layout. */}
            <motion.dl
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: DURATION.slow, ease: EASE.outExpo, delay: 0.45 }}
              className="mt-10 grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:max-w-xl"
            >
              {facts.map((fact) => (
                <div key={fact.label} className="border-t border-line pt-3">
                  <dt className="eyebrow flex text-faint">{fact.label}</dt>
                  <dd className="mt-1.5 text-body-sm text-ink">{fact.value}</dd>
                </div>
              ))}
            </motion.dl>

            {/* Stack. A list, because it is one — six chips read as "list, six
                items" rather than as a run-on line of words. */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: DURATION.slow, ease: EASE.outExpo, delay: 0.55 }}
              className="mt-8"
            >
              <p className="eyebrow flex text-faint">Built with</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <Tag as="li" key={tech}>
                    {tech}
                  </Tag>
                ))}
              </ul>
            </motion.div>

            {ctas.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: DURATION.slow, ease: EASE.outExpo, delay: 0.65 }}
                className="mt-9 flex flex-wrap items-center gap-3"
              >
                {ctas.map((cta) => (
                  <MagneticButton
                    key={cta.label}
                    as="a"
                    href={cta.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className={cn(
                      'btn group',
                      cta.variant === 'primary' ? 'btn-primary hover-glow' : 'btn-outline',
                    )}
                  >
                    {cta.label}
                    <Icon name={cta.icon ?? 'external'} className="size-4" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </MagneticButton>
                ))}
              </motion.div>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: DURATION.slower, ease: EASE.outExpo, delay: 0.25 }}
            className="lg:col-span-5"
          >
            <Parallax speed={0.1}>
              <ImageFrame
                src={hero.image ?? project.thumbnail}
                alt={project.thumbnail ? `${project.title} — cover` : ''}
                ratio="portrait"
                // Above the fold, so it is the one image on the page that must
                // not be deferred.
                loading="eager"
                placeholderLabel="Add a cover image"
                placeholderHint={`media.js → projects.${project.id}.thumbnail`}
                className="rounded-panel border border-line shadow-float"
              />
            </Parallax>
          </motion.div>
        </div>
      </div>
    </Section>
  )
}
