import { PROJECTS_SORTED } from '@/data'

import { CASE_STUDY_SLUGS } from '../slugs'

import { constructionWebsite } from './construction-website'
import { klyraStoryboard } from './klyra-storyboard'
import { dashboard } from './dashboard'
import { exmo } from './exmo'
import { evChargerFinder } from './ev-charger-finder'

/**
 * Case study registry.
 *
 * ADDING ONE
 * ----------
 *   1. Add the project to `src/data/projects.js` — that record owns the title,
 *      category, year, role, stack and thumbnail.
 *   2. Copy any file in this folder, change the slug, and write the content.
 *   3. Import it and add it to `ENTRIES` below.
 *
 * That is the whole process. Nothing in the components knows how many case
 * studies exist or what they are called: the route, the navigation between
 * them, and the "read the case study" links on the projects grid are all
 * derived from this list.
 *
 * A project with no case study is not a broken state. It simply has no page,
 * and `hasCaseStudy()` reports that so the grid can link to the ones that exist
 * and leave the rest alone.
 */
const ENTRIES = [constructionWebsite, klyraStoryboard, dashboard, exmo, evChargerFinder]

/**
 * Keyed by slug, ordered newest first.
 *
 * The order comes from `PROJECTS_SORTED` rather than from the array above, so
 * the previous/next navigation matches the order of the projects grid. Two
 * hand-maintained orderings would disagree the first time a project was added.
 */
export const CASE_STUDIES = PROJECTS_SORTED.map((project) =>
  ENTRIES.find((entry) => entry.project.slug === project.slug),
).filter(Boolean)

/** @type {Record<string, import('./schema').CaseStudy>} */
export const CASE_STUDIES_BY_SLUG = Object.fromEntries(
  CASE_STUDIES.map((entry) => [entry.project.slug, entry]),
)

/**
 * One case study by slug.
 *
 * @param {string} slug
 * @returns {import('./schema').CaseStudy|undefined} Undefined for an unknown
 *   slug — the route renders a 404 rather than an empty page.
 */
export function getCaseStudy(slug) {
  return CASE_STUDIES_BY_SLUG[slug]
}

/**
 * Guard for the one duplicated fact in this folder.
 *
 * `slugs.js` restates which projects have a case study, because the projects
 * grid cannot import this module without pulling the whole bundle with it. That
 * makes it a second source of truth, so it is checked rather than trusted: the
 * first time these two disagree, the case-study route throws with the offending
 * slug named instead of quietly showing a link to a page that does not exist.
 *
 * Runs at module evaluation, inside the lazily-loaded chunk, so it costs the
 * landing page nothing.
 */
const registered = CASE_STUDIES.map((entry) => entry.project.slug).sort()
const declared = [...CASE_STUDY_SLUGS].sort()

if (registered.join() !== declared.join()) {
  const missing = registered.filter((slug) => !declared.includes(slug))
  const extra = declared.filter((slug) => !registered.includes(slug))
  throw new Error(
    'case-studies: slugs.js and the registry disagree.' +
      (missing.length ? ' Missing from slugs.js: ' + missing.join(', ') + '.' : '') +
      (extra.length ? ' Listed in slugs.js but not registered: ' + extra.join(', ') + '.' : ''),
  )
}

/**
 * The case studies either side of this one, for the footer navigation.
 *
 * Wraps at both ends: from the last, "next" is the first. A dead end at the
 * bottom of a long page sends the reader to the browser back button, which is
 * the one place a portfolio cannot follow them.
 *
 * @param {string} slug
 * @returns {{previous: import('./schema').CaseStudy|null, next: import('./schema').CaseStudy|null}}
 */
export function getCaseStudyNeighbours(slug) {
  const index = CASE_STUDIES.findIndex((entry) => entry.project.slug === slug)
  if (index === -1 || CASE_STUDIES.length < 2) return { previous: null, next: null }

  const wrap = (i) => CASE_STUDIES[(i + CASE_STUDIES.length) % CASE_STUDIES.length]
  return { previous: wrap(index - 1), next: wrap(index + 1) }
}
