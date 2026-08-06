import { useCallback, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

import { ProjectFilters } from './ProjectFilters'
import { ProjectModal } from './ProjectModal'
import { ProjectShowcase } from './ProjectShowcase'
import { ProjectsBackground } from './ProjectsBackground'
import { Section } from '@/layouts'
import { Reveal, TextReveal } from '@/components/animations'
import { fadeInUp } from '@/animations'
import { PROJECTS_META, getProjectsByFilter } from '@/data'
import { cn } from '@/utils'

/**
 * Projects section.
 *
 * STATE
 * Two pieces, both minimal: the active filter id, and the project whose case
 * study is open. The visible list is *derived* from the filter rather than
 * stored — a second copy of the list would be one more thing to keep in sync
 * with the data, and the derivation is a single `filter` call.
 *
 * RE-RENDERS
 * `useMemo` on the filtered list and `useCallback` on both handlers mean a
 * filter change re-renders this component and the rows that actually changed.
 * `ProjectShowcase` is memoised and its `project` prop is a stable module
 * constant, so surviving rows short-circuit on a reference check instead of
 * re-rendering an image and a dozen children each.
 *
 * The modal is rendered once here rather than per row. Five mounted dialogs —
 * each with a focus trap and a scroll lock — would fight each other; one
 * dialog that takes the selected project as a prop cannot.
 */
export function Projects() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [activeProject, setActiveProject] = useState(null)

  const visibleProjects = useMemo(() => getProjectsByFilter(activeFilter), [activeFilter])

  const handleFilter = useCallback((id) => setActiveFilter(id), [])
  const handleOpenDetails = useCallback((project) => setActiveProject(project), [])
  const handleCloseDetails = useCallback(() => setActiveProject(null), [])

  return (
    <Section
      id="projects"
      labelledBy="projects-title"
      // Contains the background glows. `overflow-x-clip`, not `overflow-hidden`:
      // hidden would make this a scroll container and break `position: sticky`
      // for anything nested here later. The modal is portalled to <body>, so it
      // escapes this clip entirely.
      className="relative overflow-x-clip"
    >
      <ProjectsBackground />

      <div className="relative">
        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="max-w-3xl">
          <Reveal variants={fadeInUp}>
            <p className="eyebrow glass flex w-fit rounded-pill px-3 py-2">
              {PROJECTS_META.badge}
            </p>
          </Reveal>

          <h2 id="projects-title" className="heading-md mt-6 text-ink">
            {PROJECTS_META.headline.map((line, index) => (
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
            <p className="lead mt-6">{PROJECTS_META.intro}</p>
          </Reveal>
        </div>

        {/* ── Filters ─────────────────────────────────────────────────── */}
        <Reveal variants={fadeInUp} delay={0.15} className="mt-10 min-w-0">
          <ProjectFilters
            activeId={activeFilter}
            onSelect={handleFilter}
            resultCount={visibleProjects.length}
          />
        </Reveal>

        {/* ── Showcase ────────────────────────────────────────────────── */}
        {/* `popLayout` takes an exiting row out of flow immediately, so the rows
            below slide up while it fades rather than waiting for it to finish.
            With `mode="wait"` the list would visibly stall on every filter.

            No `initial={false}` here, deliberately. It would read as harmless —
            the rows carry no entrance of their own, so there is seemingly nothing
            to suppress — but `AnimatePresence` publishes that flag on
            `PresenceContext` and every descendant motion component honours it.
            The scroll reveals *inside* each row would render at their finished
            state and never animate. See the long note in
            `layouts/PageTransition.jsx`. */}
        <ul className="mt-16 lg:mt-20">
          <AnimatePresence mode="popLayout">
            {visibleProjects.map((project, index) => (
              <ProjectShowcase
                key={project.id}
                project={project}
                index={index}
                onOpenDetails={handleOpenDetails}
              />
            ))}
          </AnimatePresence>
        </ul>

        {/* Defensive: no filter can currently return zero, because empty ones
            are dropped in `projectsMeta.js`. It exists so that adding a filter
            later cannot produce a silently blank section. */}
        {visibleProjects.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-16 text-body-sm text-muted"
          >
            No projects in this category yet.
          </motion.p>
        )}
      </div>

      <ProjectModal project={activeProject} onClose={handleCloseDetails} />
    </Section>
  )
}
