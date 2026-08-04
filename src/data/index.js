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

export { SITE } from './site.js'
export { FOOTER } from './footer.js'
export { MEDIA, getProjectMedia } from './media.js'
export { PERSONAL } from './personal.js'
export { HERO } from './hero.js'
export { ABOUT } from './about.js'
export { JOURNEY } from './timeline.js'
export { NAV_LINKS, FOOTER_LINKS, SECTION_IDS } from './navigation.js'
export { SOCIAL_LINKS } from './socials.js'
export { SKILL_CATEGORIES, SKILL_LEVELS, ALL_SKILLS, SKILL_COUNT } from './skills.js'
export { SKILLS_META } from './skillsMeta.js'
export {
  PROJECTS,
  PROJECTS_SORTED,
  FEATURED_PROJECTS,
  PROJECT_STATUS,
  getProjectBySlug,
  getProjectsByFilter,
} from './projects.js'
export { PROJECTS_META, PROJECT_FILTERS } from './projectsMeta.js'
export { EXPERIENCE, EXPERIENCE_META, EXPERIENCE_TYPES, EDUCATION } from './experience.js'
export { SERVICES, SERVICES_META } from './services.js'
export { PROCESS_STEPS, PROCESS_META } from './process.js'
export { ACHIEVEMENTS, ACHIEVEMENTS_META } from './achievements.js'
export { TESTIMONIALS, TESTIMONIALS_META, HAS_TESTIMONIALS } from './testimonials.js'
export { POSTS, POSTS_SORTED, FEATURED_POSTS, HAS_POSTS, BLOG_META, getPostBySlug } from './blog.js'
export {
  CONTACT_META,
  CONTACT_METHODS,
  CONTACT_PANEL,
  FORM_FIELDS,
  FORM_MESSAGES,
  HONEYPOT_FIELD,
} from './contact.js'
