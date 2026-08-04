import { AboutPortrait } from './AboutPortrait'
import { HighlightCards } from './HighlightCards'
import { Timeline } from './Timeline'
import { Section } from '@/layouts'
import { Reveal, TextReveal } from '@/components/animations'
import { Icon, MagneticButton, Tag } from '@/components/ui'
import { fadeInUp } from '@/animations'
import { ABOUT, PERSONAL } from '@/data'
import { cn } from '@/utils'

/**
 * About section — story, pillars, and the developer journey.
 *
 * STRUCTURE
 *   1. Two-column intro   portrait | badge, heading, story, highlights, CTA, stack
 *   2. Four pillar cards  what I actually do
 *   3. Journey timeline   how I got here
 *
 * All three live under one `<Section id="about">` because they answer one
 * question. The nav has a single `#about` anchor, and splitting them into
 * sibling sections would give the scroll-spy three targets for one nav item and
 * make the highlight flicker as the user scrolls between them.
 *
 * HEADING OUTLINE
 * h2 for the section, h3 for each block, h4 for cards and milestones. The
 * outline is continuous with no skipped levels — it is the structure
 * screen-reader users navigate by, and it is independent of visual size, which
 * comes from `heading-*` classes.
 */
export function About() {
  return (
    // Contains the decoration: the portrait's glow orbs are sized as a
    // percentage of their column and offset negatively so the light bleeds past
    // the frame — on a narrow viewport that pushed 33px beyond the right edge
    // and gave the whole page a horizontal scrollbar.
    //
    // `overflow-x-clip`, NOT `overflow-hidden`. `hidden` makes the section a
    // scroll container, which silently breaks `position: sticky` for every
    // descendant — including the journey heading below. `clip` trims the
    // overflow without creating one, and leaves the vertical axis untouched.
    <Section id="about" labelledBy="about-title" className="overflow-x-clip">
      {/* ── Intro ─────────────────────────────────────────────────────── */}
      <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <AboutPortrait />
        </div>

        <div className="lg:col-span-7">
          <Reveal variants={fadeInUp}>
            <p className="eyebrow glass flex w-fit rounded-pill px-3 py-2">
              {ABOUT.badge}
            </p>
          </Reveal>

          <h2 id="about-title" className="heading-md mt-6 text-ink">
            {ABOUT.headline.map((line, index) => (
              <span key={line.text} className="block">
                <TextReveal
                  text={line.text}
                  inView
                  delay={index * 0.1}
                  className={cn(line.accent && 'accent-serif')}
                  // Gradient on the word, not the wrapper: each word is
                  // transformed for the reveal, and a transform on a descendant
                  // of a `background-clip: text` element promotes it to its own
                  // layer, leaving the clipped background behind and the text
                  // invisible.
                  wordClassName={cn(line.accent && 'text-gradient pr-[0.08em]')}
                />
              </span>
            ))}
          </h2>

          <Reveal variants={fadeInUp} delay={0.1}>
            <p className="lead mt-6 max-w-prose">{ABOUT.intro}</p>
          </Reveal>

          <Reveal variants={fadeInUp} delay={0.15}>
            <div className="mt-5 flex max-w-prose flex-col gap-4 text-body-sm text-muted">
              {ABOUT.story.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>
          </Reveal>

          {/* Proof points. A real <ul> so assistive tech announces the count —
              a stack of divs with tick glyphs conveys none of that. */}
          <Reveal variants={fadeInUp} delay={0.2}>
            <ul className="mt-8 flex flex-col gap-3">
              {ABOUT.highlights.map((highlight) => (
                <li key={highlight} className="flex items-start gap-3">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-accent-soft">
                    <Icon name="check" className="size-3 text-accent" />
                  </span>
                  <span className="text-body-sm text-muted">{highlight}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal variants={fadeInUp} delay={0.25}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <MagneticButton
                as="a"
                href={PERSONAL.resumeUrl}
                // `download` asks the browser to save rather than navigate —
                // correct for a CV, and it keeps the visitor on the page.
                download
                className="btn btn-primary group"
              >
                Download résumé
                <Icon
                  name="download"
                  className="size-4 transition-transform duration-base ease-out-expo group-hover:translate-y-0.5"
                />
              </MagneticButton>

              <a href="#contact" className="btn btn-ghost">
                Work with me
              </a>
            </div>
          </Reveal>

          {/* Tech stack preview */}
          <Reveal variants={fadeInUp} delay={0.3}>
            <div className="mt-10 border-t border-line pt-6">
              <h3 className="eyebrow mb-4 flex">Tech I reach for</h3>
              <ul className="flex flex-wrap gap-2">
                {ABOUT.techStack.map((tech) => (
                  <Tag as="li" key={tech}>
                    {tech}
                  </Tag>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>

      {/* ── Pillars ───────────────────────────────────────────────────── */}
      <div className="mt-section-sm">
        <Reveal variants={fadeInUp}>
          <h3 className="heading-xs text-ink">How I work</h3>
        </Reveal>

        <HighlightCards className="mt-8" />
      </div>

      {/* ── Journey ─────────────────────────────────────────────────────
          Two columns on desktop with a sticky heading. A single-rail timeline
          left-aligned in a full-width container leaves two thirds of the page
          empty; pinning the heading beside it uses that space and keeps the
          reader oriented through a long list. Below `lg` it collapses to the
          natural stacked order and the heading simply scrolls away. */}
      <div className="mt-section-sm lg:grid lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4 lg:sticky lg:top-32 lg:self-start">
          <Reveal variants={fadeInUp}>
            <p className="eyebrow flex">{ABOUT.journey.badge}</p>
            <h3 className="heading-sm mt-4 text-ink">{ABOUT.journey.title}</h3>
            <p className="lead mt-4 max-w-prose">{ABOUT.journey.description}</p>
          </Reveal>
        </div>

        <Timeline className="mt-12 lg:col-span-8 lg:mt-0" />
      </div>
    </Section>
  )
}
