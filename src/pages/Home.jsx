import { Suspense, lazy } from 'react'

// Imported from their own folders rather than the `@/sections` barrel. The
// barrel statically re-exports every section including Skills, so pulling it in
// here would defeat the dynamic import below — the bundler would already have a
// static path to that module and keep it in the entry chunk. Rolldown warns
// about exactly this (INEFFECTIVE_DYNAMIC_IMPORT).
import { Hero } from '@/sections/hero'
import { About } from '@/sections/about'

/**
 * Skills is code-split.
 *
 * It carries ~37 kB of Simple Icons brand marks — more than the rest of the app
 * combined — and sits well below the fold. Splitting it keeps that weight out of
 * the entry chunk, so the hero renders from a smaller bundle.
 *
 * `lazy` starts the fetch as soon as this route renders, not when the section
 * scrolls into view, so it downloads in parallel while the visitor is still
 * reading the hero. That is the right trade here: deferring until intersection
 * would save nothing for a user who scrolls, and would risk a visible gap.
 *
 * The `.then()` shim exists because `lazy` expects a module with a `default`
 * export, and sections use named exports throughout.
 */
const Skills = lazy(() =>
  import('@/sections/skills').then((module) => ({ default: module.Skills })),
)

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
 * The ids in the comments match `SECTION_IDS` in `@/data/navigation`, which the
 * header's scroll-spy and nav anchors resolve against. Links to sections that
 * do not exist yet are inert by design — see `hooks/useAnchorScroll`.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <About />

      {/* The fallback reserves height so the page does not collapse and jump if
          the chunk is still in flight. It is empty rather than a spinner: a
          loading indicator for something the user has not scrolled to yet is
          noise, and a skeleton that never gets seen is wasted markup. */}
      <Suspense fallback={<div aria-hidden="true" className="min-h-svh" />}>
        <Skills />
      </Suspense>

      {/* <Projects />     id="projects"     */}
      {/* <Services />     id="services"     */}
      {/* <Experience />   id="experience"   */}
      {/* <Testimonials /> id="testimonials" */}
      {/* <Blog />         id="blog"         */}
      {/* <Contact />      id="contact"      */}
    </>
  )
}
