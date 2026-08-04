import { Suspense, lazy } from 'react'

// Imported from their own folders rather than the `@/sections` barrel. The
// barrel statically re-exports every section, so pulling it in here would
// defeat the dynamic imports below — the bundler would already have a static
// path to those modules and keep them in the entry chunk. Rolldown warns about
// exactly this (INEFFECTIVE_DYNAMIC_IMPORT).
import { Hero } from '@/sections/hero'
import { About } from '@/sections/about'

/**
 * Wraps a dynamic import so `lazy` gets the `default` export it expects, while
 * sections keep their named exports.
 *
 * The `import()` argument stays a literal inside the arrow function, so the
 * bundler can still statically analyse it and emit a chunk — a loader built
 * from a variable path could not be split.
 *
 * @param {() => Promise<Record<string, React.ComponentType>>} loader
 * @param {string} name Named export to unwrap.
 */
const lazySection = (loader, name) =>
  lazy(() => loader().then((module) => ({ default: module[name] })))

/**
 * Everything below the fold is code-split.
 *
 * The hero and about section are what a visitor sees first, so they ship in the
 * entry chunk. Everything after downloads in parallel while they read — Skills
 * alone carries ~37 kB of brand marks, and Projects pulls in the modal and
 * every case-study record.
 */
const Skills = lazySection(() => import('@/sections/skills'), 'Skills')
const Projects = lazySection(() => import('@/sections/projects'), 'Projects')
const Services = lazySection(() => import('@/sections/services'), 'Services')
const Process = lazySection(() => import('@/sections/process'), 'Process')
const Experience = lazySection(() => import('@/sections/experience'), 'Experience')
const Achievements = lazySection(() => import('@/sections/Achievements'), 'Achievements')

/**
 * Fallback for a section still in flight.
 *
 * Reserves height so the page cannot collapse and jump. Empty rather than a
 * spinner — a loading indicator for something the visitor has not scrolled to
 * yet is noise, and a skeleton that is never seen is wasted markup.
 */
const Placeholder = () => <div aria-hidden="true" className="min-h-svh" />

/**
 * Home route.
 *
 * A page is a *composition root*: it declares which sections appear and in what
 * order, and nothing else. No layout maths, no data access, no styling.
 *
 * Keeping pages this thin is what makes the architecture scale — reordering the
 * site becomes reordering these lines, and any section can be lifted onto its
 * own route without being rewritten.
 *
 * Each lazy section gets its OWN Suspense boundary. Suspense resolves as a
 * unit, so a shared boundary would make every section wait for the slowest
 * chunk before any of them could render.
 *
 * The ids match `SECTION_IDS` in `@/data/navigation`, which the header's
 * scroll-spy and nav anchors resolve against. `#process` and `#achievements`
 * have no nav entry by design — they are read on the way past, not navigated to.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <About />

      <Suspense fallback={<Placeholder />}>
        <Skills />
      </Suspense>

      <Suspense fallback={<Placeholder />}>
        <Projects />
      </Suspense>

      <Suspense fallback={<Placeholder />}>
        <Services />
      </Suspense>

      <Suspense fallback={<Placeholder />}>
        <Process />
      </Suspense>

      <Suspense fallback={<Placeholder />}>
        <Experience />
      </Suspense>

      <Suspense fallback={<Placeholder />}>
        <Achievements />
      </Suspense>

      {/* <Testimonials /> id="testimonials" */}
      {/* <Blog />         id="blog"         */}
      {/* <Contact />      id="contact"      */}
    </>
  )
}
