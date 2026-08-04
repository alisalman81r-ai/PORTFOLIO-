/**
 * Working process.
 *
 * Sets expectations before a first call. Its own file rather than part of
 * `services.js` because it answers a different question: services are *what*
 * you buy, this is *how it runs* — and the process rarely changes when the
 * service list does.
 *
 * Four steps is deliberate. Enough to show there is a method; few enough that
 * someone reads all of them.
 */

export const PROCESS_META = {
  badge: 'How I Work',
  headline: [{ text: 'A process, not' }, { text: 'a black box', accent: true }],
  intro:
    'You should know what happens next at every point in a project. This is the sequence I follow, and what you get out of each stage.',
}

/**
 * @typedef {object} ProcessStep
 * @property {string} id
 * @property {string} number      Zero-padded for display. Not derived from the
 *   index, so a step can be inserted without renumbering the rest by hand.
 * @property {string} icon        Registry key resolved by `<Icon />`.
 * @property {string} title
 * @property {string} description What happens, in the client's terms.
 * @property {string} outcome     What exists at the end of this step. The part
 *   clients actually care about.
 */

/** @type {ProcessStep[]} */
export const PROCESS_STEPS = [
  {
    id: 'discovery',
    number: '01',
    icon: 'discovery',
    title: 'Discovery & Planning',
    description:
      'Goals, audience and constraints before anything is designed. I would rather find the awkward requirement in week one than in week six.',
    outcome: 'Agreed scope and success criteria',
  },
  {
    id: 'design',
    number: '02',
    icon: 'handoff',
    title: 'Design & Architecture',
    description:
      'Structure first, then surface: content model, page hierarchy, and a type and spacing system. Decisions are made once and applied everywhere.',
    outcome: 'Design system and technical plan',
  },
  {
    id: 'development',
    number: '03',
    icon: 'build',
    title: 'Development',
    description:
      'Built component-first with staged reviews, so you see progress in the browser rather than in a status update. Accessibility and performance are checked as I go.',
    outcome: 'Working build on a preview URL',
  },
  {
    id: 'deployment',
    number: '04',
    icon: 'deploy',
    title: 'Testing & Deployment',
    description:
      'Cross-device and cross-browser testing, a Core Web Vitals pass, then deployment. Handover includes documentation for whoever maintains it next.',
    outcome: 'Live site and handover docs',
  },
]
