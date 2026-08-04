import { PROJECTS } from './projects.js'
import { ALL_SKILLS } from './skills.js'

/**
 * Achievement counters.
 *
 * TWO OF THESE ARE DERIVED, AND THAT IS THE POINT
 * -----------------------------------------------
 * "Projects completed" and "Technologies learned" are computed from
 * `projects.js` and `skills.js`. Ship a project or add a skill and the counter
 * moves on its own — it can never be quietly wrong, which is the usual fate of
 * a hand-typed statistic that was accurate the day it was written.
 *
 * Prefer deriving. If a number can be counted from data the site already holds,
 * count it.
 *
 * ⚠️ THE OTHER TWO ARE PLACEHOLDERS. `repositories` and `learningHours` cannot
 * be derived from anything here, so they carry round placeholder values purely
 * so the counter animation has something to run against. They are claims about
 * you. Replace them with real figures or delete the entries — a portfolio
 * asserting "500 learning hours" it cannot support is worse than one that
 * shows three honest numbers.
 */

export const ACHIEVEMENTS_META = {
  badge: 'By the Numbers',
  headline: [{ text: 'Progress worth' }, { text: 'measuring', accent: true }],
  intro:
    'Counted from the work itself where possible, rather than rounded up for effect.',
}

/**
 * @typedef {object} Achievement
 * @property {string} id
 * @property {string} icon    Registry key resolved by `<Icon />`.
 * @property {number} value   Final figure the counter animates to.
 * @property {string} [suffix] Appended to the number, e.g. '+' or 'h'.
 * @property {string} label   What the figure counts.
 * @property {string} detail  One line of context, so the number means something.
 * @property {boolean} derived Whether the value is computed from site data.
 *   Rendered as a small marker — a number you can verify is worth more than one
 *   you cannot.
 */

/** @type {Achievement[]} */
export const ACHIEVEMENTS = [
  {
    id: 'projects',
    icon: 'briefcase',
    value: PROJECTS.length,
    label: 'Projects completed',
    detail: 'Counted from the case studies on this site',
    derived: true,
  },
  {
    id: 'technologies',
    icon: 'fullstack',
    value: ALL_SKILLS.length,
    label: 'Technologies learned',
    detail: 'Counted from the skills matrix',
    derived: true,
  },
  {
    id: 'repositories',
    icon: 'repo',
    // PLACEHOLDER — replace with your real public repository count.
    value: 20,
    suffix: '+',
    label: 'GitHub repositories',
    detail: 'Public work and experiments',
    derived: false,
  },
  {
    id: 'learning-hours',
    icon: 'clock',
    // PLACEHOLDER — replace, or delete this entry entirely.
    value: 500,
    suffix: '+',
    label: 'Learning hours',
    detail: 'Deliberate practice outside project work',
    derived: false,
  },
]
