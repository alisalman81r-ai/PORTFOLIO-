/**
 * Services offered.
 *
 * What a prospective client can hire you for. Distinct from `skills.js`:
 * skills are tools you know, services are outcomes you sell. A client buys
 * "a site that loads fast and converts", not "React".
 */

/**
 * @typedef {object} Service
 * @property {string} id
 * @property {string} title       Short, outcome-shaped.
 * @property {string} description Two or three sentences on what is included.
 * @property {string[]} deliverables Concrete artefacts the client receives.
 * @property {string} icon        Lookup key for an icon component. See `socials.js`.
 * @property {string} [startingAt] Optional price anchor, e.g. 'From $X'.
 *   Leave empty to keep pricing to conversations.
 */

/**
 * Generic starter set — edit to match what you actually offer.
 *
 * Kept deliberately broad rather than invented: these are common web
 * engagements, not claims about your specific practice. Three or four focused
 * services read as expertise; ten read as a freelancer who will take anything.
 *
 * @type {Service[]}
 */
export const SERVICES = [
  {
    id: 'web-design',
    title: 'Web Design',
    description:
      'Interface and interaction design for marketing sites and product surfaces, delivered as a system rather than a set of one-off screens.',
    deliverables: ['Design system', 'Responsive layouts', 'Prototype'],
    icon: 'palette',
    startingAt: '',
  },
  {
    id: 'development',
    title: 'Frontend Development',
    description:
      'Production frontends built for maintenance as much as launch — typed contracts, accessible markup, and a measured performance budget.',
    deliverables: ['Component library', 'Responsive build', 'CMS integration'],
    icon: 'code',
    startingAt: '',
  },
  {
    id: 'motion',
    title: 'Motion & Interaction',
    description:
      'Scroll-driven sequences, page transitions, and micro-interactions that stay smooth on mid-range hardware and respect reduced-motion preferences.',
    deliverables: ['Motion spec', 'Animation implementation', 'Performance audit'],
    icon: 'sparkles',
    startingAt: '',
  },
  {
    id: 'performance',
    title: 'Performance & Accessibility',
    description:
      'Audit and remediation for Core Web Vitals and WCAG compliance, with the findings documented so the gains do not regress after handover.',
    deliverables: ['Audit report', 'Prioritised fixes', 'Implementation'],
    icon: 'gauge',
    startingAt: '',
  },
]

/**
 * The process shown alongside services — sets expectations before a first call.
 *
 * @typedef {object} ProcessStep
 * @property {string} id
 * @property {string} step    Zero-padded index, for display ('01').
 * @property {string} title
 * @property {string} description
 */

/** @type {ProcessStep[]} */
export const PROCESS = [
  {
    id: 'discover',
    step: '01',
    title: 'Discover',
    description: 'Goals, audience, and constraints — before anything is designed.',
  },
  {
    id: 'design',
    step: '02',
    title: 'Design',
    description: 'Direction, then a system: type, colour, spacing, and motion.',
  },
  {
    id: 'build',
    step: '03',
    title: 'Build',
    description: 'Accessible, performant implementation with staged review.',
  },
  {
    id: 'launch',
    step: '04',
    title: 'Launch',
    description: 'Deploy, measure, hand over documentation.',
  },
]
