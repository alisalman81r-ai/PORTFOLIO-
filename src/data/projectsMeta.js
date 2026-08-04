import { PROJECTS } from './projects'

/**
 * Projects section copy and filter definitions.
 *
 * Separate from `projects.js` so that file stays a pure inventory of work.
 * Section headings change for editorial reasons; the portfolio changes when you
 * ship something. Different reasons to edit, different files.
 */

export const PROJECTS_META = {
  badge: 'Featured Work',

  /** Same line model as the other sections: `accent` marks the one line rendered
   *  in italic serif with a gradient fill. */
  headline: [{ text: 'Work worth' }, { text: 'shipping', accent: true }],

  intro:
    'Anyone can make a screen look good in a mockup. What matters is whether it holds up — on a slow connection, on a small phone, in the hands of someone who has never seen it before. These are projects where that was the standard.',
}

/**
 * Filter definitions.
 *
 * `id` must match the values in each project's `filters` array. Counts are
 * derived rather than typed, so they can never drift out of sync with the data.
 *
 * @typedef {object} ProjectFilter
 * @property {string} id
 * @property {string} label
 * @property {number} count
 */

const FILTER_DEFINITIONS = [
  { id: 'all', label: 'All' },
  { id: 'web-apps', label: 'Web Apps' },
  { id: 'frontend', label: 'Frontend' },
  { id: 'full-stack', label: 'Full Stack' },
  { id: 'ui-ux', label: 'UI/UX' },
  { id: 'creative', label: 'Creative' },
]

/**
 * Filters with live counts, and empty ones removed.
 *
 * A filter that returns nothing is a dead control — it invites a click and
 * rewards it with a blank panel. Dropping empties means the filter bar always
 * reflects the work that actually exists, and it self-maintains as projects are
 * added or removed.
 *
 * @type {ProjectFilter[]}
 */
export const PROJECT_FILTERS = FILTER_DEFINITIONS.map((filter) => ({
  ...filter,
  count:
    filter.id === 'all'
      ? PROJECTS.length
      : PROJECTS.filter((project) => project.filters.includes(filter.id)).length,
})).filter((filter) => filter.count > 0)
