import { JOURNEY_START_YEAR } from './timeline.js'
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
 * A third is now derived too: years of experience counts from
 * `JOURNEY_START_YEAR` in `timeline.js`, so it advances on its own every year
 * and can never contradict the timeline printed above it. A hardcoded "3 years"
 * is wrong within twelve months and stays wrong.
 *
 * ⚠️ ONE PLACEHOLDER REMAINS. `repositories` cannot be derived from anything
 * here, so it carries a round placeholder purely so the counter has something to
 * run against. It is a claim about you — replace it with your real public repo
 * count, or delete the entry. Three verifiable numbers beat four where one is
 * invented.
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
    id: 'experience',
    icon: 'clock',
    // Counts from the first entry in the journey, so it advances by itself.
    value: Math.max(1, new Date().getFullYear() - JOURNEY_START_YEAR),
    suffix: '+',
    label: 'Years in design & code',
    detail: `Designing since ${JOURNEY_START_YEAR}, building since 2024`,
    derived: true,
  },
]
