/**
 * Page sections — the composed blocks a page is assembled from.
 *
 * SECTION vs COMPONENT
 * --------------------
 * A component is reusable and context-free: it knows nothing about where it
 * sits and gets everything through props (`Button`, `TiltCard`, `RotatingText`).
 *
 * A section is a specific, named block of a specific page. It is allowed the
 * two things a component must not do:
 *   - import from `@/data` directly
 *   - know its own place in the page (its id, its heading, its order)
 *
 * That asymmetry keeps components pure and pages thin.
 *
 * STRUCTURE
 * A section is one file until a part of it becomes independently meaningful,
 * at which point it becomes a folder with its own barrel (see `hero/`). Only
 * the section itself is exported; its internals stay private.
 *
 * WHAT A SECTION NEVER WRITES
 * `max-w-*`, `py-*`, `mx-auto`, or a raw colour. Width comes from `<Container>`,
 * rhythm from `<Section>`, motion from the animation wrappers, colour from
 * semantic tokens. If a section needs a magic number, the token is missing —
 * add it to `styles/theme.css`.
 */

export { Hero } from './hero'
export { About } from './about'
export { Skills } from './skills'
export { Projects } from './projects'
export { Services } from './services'
export { Process } from './process'
export { Experience } from './experience'
export { Achievements } from './Achievements'
export { Testimonials } from './testimonials'
export { Blog } from './blog'
export { Contact } from './contact'
