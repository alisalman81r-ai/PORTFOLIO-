/**
 * Portfolio projects.
 *
 * The most important data in the site — the work is what a visitor came for.
 * Shaped to support both a grid card and a full case-study page from one
 * record, so a project never needs entering twice.
 *
 * IMAGES: leave as `null` until real files exist. Import them from
 * `@/assets/images` rather than using string paths — Vite then fingerprints,
 * optimises, and fails the *build* on a missing file instead of shipping a
 * broken <img> to production.
 *
 *   import projectCover from '@/assets/images/project-one-cover.jpg'
 */

/**
 * @typedef {object} Project
 * @property {string} slug        URL segment. Stable — changing it breaks links.
 * @property {string} title       Project name.
 * @property {string} client      Client or company. Use 'Personal' for self-directed work.
 * @property {number} year        Completion year. Drives default sort.
 * @property {string} category    Primary discipline, e.g. 'Web Design'.
 * @property {string[]} roles     What you actually did. Be precise — credit matters.
 * @property {string} summary     One sentence for the card.
 * @property {string} [problem]   Case study: what was wrong before.
 * @property {string} [solution]  Case study: what you built.
 * @property {string} [outcome]   Case study: measurable result. Only real numbers.
 * @property {string[]} stack     Technologies used.
 * @property {string|null} cover  Card/hero image. Imported asset.
 * @property {string[]} gallery   Additional imagery for the case study.
 * @property {string} [liveUrl]   Deployed site. Empty string hides the link.
 * @property {string} [repoUrl]   Source, if public.
 * @property {boolean} featured   Surfaced on the home page.
 * @property {boolean} [archived] Hidden from the main grid, kept for an archive page.
 */

/**
 * PLACEHOLDER — three records so grid layouts, sort, and filtering can be
 * built against real shapes.
 *
 * Every value is written to read as a slot ('PROJECT ONE', 'CLIENT NAME')
 * rather than as invented work. Fabricated project names and outcome metrics
 * are a genuine liability in a portfolio: they are claims about what you have
 * done, and a plausible fake can ship unnoticed.
 *
 * Replace these entirely — do not edit around them.
 *
 * @type {Project[]}
 */
export const PROJECTS = [
  {
    slug: 'project-one',
    title: 'PROJECT ONE',
    client: 'CLIENT NAME',
    year: 2025,
    category: 'CATEGORY',
    roles: ['ROLE'],
    summary: 'ONE SENTENCE DESCRIBING THE PROJECT.',
    problem: 'WHAT WAS WRONG BEFORE.',
    solution: 'WHAT YOU BUILT.',
    outcome: 'MEASURABLE RESULT — use real numbers or delete this field.',
    stack: ['TECH', 'TECH', 'TECH'],
    cover: null,
    gallery: [],
    liveUrl: '',
    repoUrl: '',
    featured: true,
  },
  {
    slug: 'project-two',
    title: 'PROJECT TWO',
    client: 'CLIENT NAME',
    year: 2025,
    category: 'CATEGORY',
    roles: ['ROLE'],
    summary: 'ONE SENTENCE DESCRIBING THE PROJECT.',
    stack: ['TECH', 'TECH'],
    cover: null,
    gallery: [],
    liveUrl: '',
    repoUrl: '',
    featured: true,
  },
  {
    slug: 'project-three',
    title: 'PROJECT THREE',
    client: 'Personal',
    year: 2024,
    category: 'CATEGORY',
    roles: ['ROLE'],
    summary: 'ONE SENTENCE DESCRIBING THE PROJECT.',
    stack: ['TECH'],
    cover: null,
    gallery: [],
    liveUrl: '',
    repoUrl: '',
    featured: false,
  },
]

/**
 * Projects shown on the home page, newest first.
 *
 * Derived selectors live beside the data so a section component stays purely
 * presentational — it renders a list, it does not decide what the list means.
 *
 * @type {Project[]}
 */
export const FEATURED_PROJECTS = PROJECTS.filter(
  (project) => project.featured && !project.archived,
).sort((a, b) => b.year - a.year)

/**
 * Look up a single project — for a `/work/:slug` case-study route.
 *
 * @param {string} slug
 * @returns {Project|undefined} Undefined for an unknown slug; the route should
 *   render a 404 rather than an empty page.
 */
export function getProjectBySlug(slug) {
  return PROJECTS.find((project) => project.slug === slug)
}

/**
 * Unique categories, for filter controls.
 * @returns {string[]}
 */
export function getProjectCategories() {
  return [...new Set(PROJECTS.map((project) => project.category))]
}
