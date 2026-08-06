/**
 * Case studies — public surface.
 *
 * The route imports `CaseStudy` and the lookup helpers; nothing outside this
 * folder should reach into `components/`. Keeping the barrel this narrow is what
 * lets the internals be reorganised without touching the app.
 */

export { CaseStudy } from './CaseStudy'
export { CASE_STUDIES, getCaseStudy, getCaseStudyNeighbours } from './data'

/**
 * Deliberately re-exported from `slugs.js` rather than from `data`.
 *
 * Anything importing this barrel already pays for the whole case-study bundle,
 * so it makes no difference here — but code that only needs the predicate must
 * import `@/case-studies/slugs` directly and skip the barrel entirely. See the
 * note in that file.
 */
export { hasCaseStudy, CASE_STUDY_SLUGS } from './slugs'
