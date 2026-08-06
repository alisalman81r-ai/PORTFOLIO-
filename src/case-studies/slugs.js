/**
 * Which projects have a case study — as a standalone list with no imports.
 *
 * WHY THIS EXISTS RATHER THAN A HELPER IN `data/index.js`
 * The projects grid needs to know whether to show a "read the case study" link.
 * Importing the real registry to answer that pulled the entire case-study
 * bundle — every project's prose, all fourteen section components, and
 * `TechIcon` with its brand marks — into the projects chunk. Measured: 60 kB
 * (16.6 kB gzipped) preloaded on the landing page to evaluate one boolean.
 *
 * This module imports nothing, so it costs a few bytes wherever it is used. It
 * is the same reasoning that keeps `TechIcon` out of the `@/components/ui`
 * barrel, and this project has now paid for that lesson three times.
 *
 * THE DUPLICATION IS REAL, AND IT IS GUARDED
 * This list restates what `data/index.js` already knows, which is exactly the
 * kind of second source that drifts. So `data/index.js` asserts the two agree
 * when it loads: add a case study without adding its slug here — or the reverse
 * — and the case-study route throws immediately with the mismatch named.
 *
 * Keep it alphabetical. The display order is derived from `projects.js`, so the
 * order here carries no meaning and sorting makes a missing entry visible.
 */
export const CASE_STUDY_SLUGS = [
  'construction-website',
  'dashboard',
  'ev-charger-finder',
  'exmo',
  'klyra-storyboard',
]

/**
 * Whether a project has a case study to link to.
 *
 * @param {string} slug
 * @returns {boolean}
 */
export function hasCaseStudy(slug) {
  return CASE_STUDY_SLUGS.includes(slug)
}
