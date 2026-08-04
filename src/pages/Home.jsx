/**
 * Home route.
 *
 * A page is a *composition root*: it declares which sections appear and in what
 * order, and nothing else. No layout maths, no data access, no styling.
 *
 * Keeping pages this thin is what makes the architecture scale — reordering the
 * site becomes reordering these lines, and a section can be lifted onto its own
 * route without being rewritten.
 *
 * Sections are imported from `@/sections` and slot in below as they are built.
 * The ids in the comments match `SECTION_IDS` in `@/data/navigation`, which is
 * what the header's scroll-spy and the nav anchors resolve against.
 */
export default function Home() {
  return (
    <>
      {/* <Hero />         id="hero"     */}
      {/* <Work />         id="work"     */}
      {/* <About />        id="about"    */}
      {/* <Services />     id="services" */}
      {/* <Testimonials /> — gated on HAS_TESTIMONIALS */}
      {/* <Contact />      id="contact"  */}
    </>
  )
}
