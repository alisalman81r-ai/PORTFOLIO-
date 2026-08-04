import { useCallback, useMemo, useState } from 'react'

import { SkillCategories } from './SkillCategories'
import { SkillPanel } from './SkillPanel'
import { SkillsBackground } from './SkillsBackground'
import { Section } from '@/layouts'
import { Reveal, TextReveal } from '@/components/animations'
import { fadeInUp } from '@/animations'
import { SKILL_CATEGORIES, SKILLS_META } from '@/data'
import { cn } from '@/utils'

/**
 * Skills section.
 *
 * STATE
 * One piece of state for the whole section: the selected category id, held
 * here because it is the only thing the rail and the panel both need. Storing
 * the whole category object instead would make every equality check a deep one;
 * an id keeps it a string compare and keeps the data as the single source of
 * truth.
 *
 * RE-RENDERS
 * `onSelect` is wrapped in `useCallback` and the resolved category in `useMemo`,
 * so switching tabs re-renders the rail and the panel and stops there —
 * `SkillCard` is memoised and its `skill` prop is a stable module constant, so
 * every card short-circuits on a reference check.
 *
 * The id is derived by lookup rather than stored as an index: reordering
 * `SKILL_CATEGORIES` would silently change which tab an index points at, while
 * an id survives any reordering.
 */
export function Skills() {
  const [activeId, setActiveId] = useState(SKILL_CATEGORIES[0].id)

  const activeCategory = useMemo(
    () => SKILL_CATEGORIES.find((category) => category.id === activeId) ?? SKILL_CATEGORIES[0],
    [activeId],
  )

  const handleSelect = useCallback((id) => setActiveId(id), [])

  return (
    <Section
      id="skills"
      labelledBy="skills-title"
      // Contains the background decoration. `overflow-x-clip`, not
      // `overflow-hidden`: hidden would make this a scroll container and break
      // `position: sticky` for anything nested here later.
      className="relative overflow-x-clip"
    >
      <SkillsBackground />

      <div className="relative">
        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="max-w-3xl">
          <Reveal variants={fadeInUp}>
            <p className="eyebrow glass flex w-fit rounded-pill px-3 py-2">
              {SKILLS_META.badge}
            </p>
          </Reveal>

          <h2 id="skills-title" className="heading-md mt-6 text-ink">
            {SKILLS_META.headline.map((line, index) => (
              <span key={line.text} className="block">
                <TextReveal
                  text={line.text}
                  inView
                  delay={index * 0.1}
                  className={cn(line.accent && 'accent-serif')}
                  // Gradient on the word, not the wrapper: each word is
                  // transformed for the reveal, and a transform on a descendant
                  // of a `background-clip: text` element promotes it to its own
                  // layer, leaving the text invisible.
                  wordClassName={cn(line.accent && 'text-gradient pr-[0.08em]')}
                />
              </span>
            ))}
          </h2>

          <Reveal variants={fadeInUp} delay={0.1}>
            <p className="lead mt-6">{SKILLS_META.intro}</p>
          </Reveal>
        </div>

        {/* ── Rail + panel ────────────────────────────────────────────── */}
        {/* `min-w-0` on both columns is load-bearing.
            A grid item's automatic minimum size is its *min-content* width, not
            zero. The category rail is a flex row of six `shrink-0` buttons, so
            its min-content is the full ~700px of tabs — which forced this grid
            wider than a phone viewport and pushed the panel off-screen, where
            `overflow-x-clip` silently truncated it rather than showing a
            scrollbar. `min-w-0` lets the columns shrink and hands scrolling back
            to the rail's own `overflow-x-auto`, which is where it belongs. */}
        <div className="mt-12 grid gap-8 lg:mt-16 lg:grid-cols-12 lg:gap-12">
          <Reveal variants={fadeInUp} className="min-w-0 lg:col-span-3">
            {/* Sticky so the rail stays reachable while a long category is
                read. Safe because the section clips on the x-axis only. */}
            <SkillCategories
              categories={SKILL_CATEGORIES}
              activeId={activeId}
              onSelect={handleSelect}
              className="lg:sticky lg:top-32"
            />
          </Reveal>

          <Reveal variants={fadeInUp} delay={0.1} className="min-w-0 lg:col-span-9">
            <SkillPanel category={activeCategory} />
          </Reveal>
        </div>
      </div>
    </Section>
  )
}
