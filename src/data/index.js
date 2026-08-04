/**
 * Barrel export for static content.
 *
 * WHY CONTENT LIVES AS DATA, NOT JSX
 * ----------------------------------
 * Every string, project record, and nav link is declared here rather than
 * inline in a component. That buys four things:
 *
 *   1. Copy edits never touch rendering logic — no risk of breaking a layout
 *      while fixing a typo.
 *   2. Sections become pure functions of their data: pass a different array and
 *      the same component renders a different page.
 *   3. The shapes are documented by JSDoc typedefs, so an editor autocompletes
 *      `project.` and flags a misspelled field.
 *   4. This directory is the seam where a CMS drops in. Swap these modules for
 *      fetched JSON of the same shape and not one component changes.
 *
 * Derived values (`FEATURED_PROJECTS`, `EXPERIENCE_SORTED`, `ALL_SKILLS`) are
 * computed beside their source rather than in components — so "which projects
 * are featured" is answered once, not re-implemented per view.
 *
 *   import { PROJECTS, PERSONAL, NAV_LINKS } from '@/data'
 */

export { SITE } from './site'
export { PERSONAL } from './personal'
export { HERO } from './hero'
export { ABOUT } from './about'
export { JOURNEY } from './timeline'
export { NAV_LINKS, FOOTER_LINKS, SECTION_IDS } from './navigation'
export { SOCIAL_LINKS } from './socials'
export { SKILL_CATEGORIES, SKILL_LEVELS, ALL_SKILLS, SKILL_COUNT } from './skills'
export { SKILLS_META } from './skillsMeta'
export {
  PROJECTS,
  FEATURED_PROJECTS,
  getProjectBySlug,
  getProjectCategories,
} from './projects'
export { EXPERIENCE, EXPERIENCE_SORTED, EDUCATION } from './experience'
export { SERVICES, PROCESS } from './services'
export { TESTIMONIALS, HAS_TESTIMONIALS } from './testimonials'
