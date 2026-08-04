/**
 * Page sections — the composed blocks a page is assembled from.
 *
 * Empty until real sections are built.
 *
 * SECTION vs COMPONENT
 * --------------------
 * A component is reusable and context-free: it knows nothing about where it
 * sits and gets everything through props (`Button`, `ProjectCard`, `Marquee`).
 *
 * A section is a specific, named block of a specific page. It is allowed to do
 * the two things a component must not:
 *   - import from `@/data` directly
 *   - know its own place in the page (its id, its heading, its order)
 *
 * That asymmetry is the whole point. Sections are where content and layout
 * meet, which keeps components pure and reusable — and keeps pages thin.
 *
 * THE SHAPE EVERY SECTION FOLLOWS
 * -------------------------------
 *   import { Section } from '@/layouts'
 *   import { Reveal, Stagger, StaggerItem } from '@/components/animations'
 *   import { FEATURED_PROJECTS } from '@/data'
 *
 *   export function Work() {
 *     return (
 *       <Section id="work" labelledBy="work-title">
 *         <Reveal>
 *           <p className="eyebrow">Selected Work</p>
 *           <h2 id="work-title" className="heading-lg">Recent projects</h2>
 *         </Reveal>
 *
 *         <Stagger as="ul" className="mt-block grid gap-6 md:grid-cols-2">
 *           {FEATURED_PROJECTS.map((project) => (
 *             <StaggerItem as="li" key={project.slug}>
 *               <ProjectCard project={project} />
 *             </StaggerItem>
 *           ))}
 *         </Stagger>
 *       </Section>
 *     )
 *   }
 *
 * Note what the section does NOT do: no `max-w-*`, no `py-*`, no `mx-auto`, no
 * raw colour. Spacing comes from `<Section>`, width from `<Container>`, motion
 * from the animation wrappers, and colour from semantic tokens. If a section
 * needs a magic number, the token is missing — add it to `styles/theme.css`.
 *
 * Add each section's export below as it is built.
 */

export {}
