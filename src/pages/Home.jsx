import { About, Hero } from '@/sections'

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

      {/* <Skills />       id="skills"       */}
      {/* <Projects />     id="projects"     */}
      {/* <Services />     id="services"     */}
      {/* <Experience />   id="experience"   */}
      {/* <Testimonials /> id="testimonials" */}
      {/* <Blog />         id="blog"         */}
      {/* <Contact />      id="contact"      */}
    </>
  )
}
