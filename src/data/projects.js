/**
 * Project case studies.
 *
 * The most important data in the site — the work is what a visitor came for.
 * One record drives both the showcase row and the full detail modal, so a
 * project is never entered twice.
 *
 * ADDING A PROJECT
 * ----------------
 * Append an object to `PROJECTS`. Nothing else changes: the alternating layout,
 * the filter counts, the ordering and the modal all derive from this array. The
 * architecture takes an unlimited number.
 *
 * IMAGES
 * Leave `thumbnail` as `null` and `gallery` as `[]` until real files exist —
 * both render a designed placeholder rather than a broken image. When you have
 * them, IMPORT rather than writing a string path:
 *
 *   import cover from '@/assets/images/construction-cover.jpg'
 *   …
 *   thumbnail: cover,
 *
 * Vite then fingerprints and optimises the file, and a typo fails the *build*
 * instead of shipping a broken <img> to production.
 *
 * ⚠️ PLACEHOLDER COPY. The project names are yours; everything written
 * about them is generic scaffolding shaped to the project type, so the layout
 * can be judged with realistic line lengths. `status` values are guesses.
 * No metrics are invented anywhere — `results` is qualitative on purpose.
 * Rewrite it all; the structure will hold.
 */

import { getProjectMedia } from './media.js'

/**
 * Delivery status. Drives the badge on the card.
 * @typedef {'live'|'in-development'|'concept'|'archived'} ProjectStatus
 */
export const PROJECT_STATUS = {
  live: { label: 'Live', tone: 'accent' },
  'in-development': { label: 'In development', tone: 'default' },
  concept: { label: 'Concept', tone: 'outline' },
  archived: { label: 'Archived', tone: 'outline' },
}

/**
 * @typedef {object} Project
 * @property {string} id
 * @property {string} slug          URL segment. Stable — changing it breaks links.
 * @property {string} title
 * @property {string} category      Display label, e.g. 'Full Stack Web App'.
 * @property {string[]} filters     Filter ids this project matches. An array,
 *   not a single value: real work rarely belongs to exactly one bucket, and a
 *   project can legitimately appear under both Frontend and Full Stack.
 * @property {number} year
 * @property {ProjectStatus} status
 * @property {string} shortDescription  One or two sentences for the card.
 * @property {string} longDescription   Opening paragraph of the case study.
 * @property {string} problem       What was wrong before.
 * @property {string} solution      What you built, and why that way.
 * @property {string[]} technologies
 * @property {string} role         What you actually did. Be precise — credit
 *   matters, and "Design & Development" reads very differently from "Frontend".
 * @property {string} duration     How long it ran, e.g. '6 weeks'. Sets the
 *   scale of the engagement, which is the first thing a client wants to know.
 * @property {{title: string, description: string}[]} features
 * @property {{challenge: string, solution: string}[]} challenges  Paired, because
 *   a challenge without its resolution is just a complaint.
 * @property {{step: string, title: string, description: string}[]} process
 * @property {string[]} results     Qualitative outcomes. NO INVENTED NUMBERS —
 *   a fabricated "40% faster" is a claim you would have to defend.
 * @property {string|null} thumbnail Resolved from `media.js` — never set here.
 * @property {string[]} gallery     Resolved from `media.js` — never set here.
 * @property {string} githubUrl     Empty string renders the button disabled.
 * @property {string} liveUrl       Empty string renders the button disabled.
 * @property {boolean} featured
 */

/** @type {Project[]} */
export const PROJECTS = [
  {
    id: 'construction-website',
    slug: 'construction-website',
    title: 'Construction Website',
    category: 'Marketing Site',
    filters: ['web-apps', 'frontend'],
    year: 2025,
    status: 'live',
    role: 'Design & Frontend Development',
    duration: '6 weeks',
    shortDescription:
      'A client-facing marketing site for a construction firm, with a content structure the team can maintain without a developer.',
    longDescription:
      'The brief was credibility: this is a business people hand large sums of money to, and the site had to look like one that finishes what it starts. Equally important was that the client could add a project without calling me.',
    problem:
      'The existing site was a brochure that could not be updated, so the portfolio was years out of date — the single thing a prospective client most wants to see.',
    solution:
      'A component-driven build with a clear content model, so new projects and services slot into existing layouts. Type and spacing scale with the viewport, which keeps the site solid on the phones most of its traffic arrives on.',
    technologies: ['React', 'Next.js', 'Tailwind CSS', 'Vercel'],
    features: [
      { title: 'Project gallery', description: 'Completed work presented as case studies rather than a photo dump.' },
      { title: 'Editable content model', description: 'New entries follow a defined shape, so layouts never break.' },
      { title: 'Enquiry flow', description: 'A short, forgiving form — validation that guides rather than scolds.' },
      { title: 'Responsive from the start', description: 'Designed at mobile width first, where most of the traffic is.' },
    ],
    challenges: [
      {
        challenge: 'Large photography is central to the pitch but is the heaviest thing on the page.',
        solution: 'Responsive sources with reserved aspect ratios, so images never cause layout shift as they load.',
      },
      {
        challenge: 'The client needed to add projects without breaking the layout.',
        solution: 'Constrained the content model and documented it, so every entry renders predictably.',
      },
    ],
    process: [
      { step: '01', title: 'Discovery', description: 'Understood who the client wins work from and what convinces them.' },
      { step: '02', title: 'Structure', description: 'Content model and page hierarchy before any visual design.' },
      { step: '03', title: 'Design', description: 'A type and colour system that reads as established, not trendy.' },
      { step: '04', title: 'Handover', description: 'Documented how to add work and deployed to a preview flow.' },
    ],
    results: [
      'Client updates the portfolio without developer involvement',
      'Imagery loads without layout shift on slow connections',
      'One layout system carries every page type',
    ],
    thumbnail: getProjectMedia('construction-website').thumbnail,
    gallery: getProjectMedia('construction-website').gallery,
    githubUrl: '',
    liveUrl: '',
    featured: true,
  },
  {
    id: 'klyra-storyboard',
    slug: 'klyra-storyboard',
    title: 'Storyboard Design — Klyra',
    category: 'Design & Direction',
    filters: ['ui-ux', 'creative'],
    year: 2025,
    status: 'live',
    role: 'Creative Direction & Storyboarding',
    duration: '3 weeks',
    shortDescription:
      'Narrative and visual direction for a client project — mapping the flow and pacing of the experience before implementation began.',
    longDescription:
      'Work that happened before any code: deciding what the experience says, in what order, and how it should feel moving between beats. The storyboard became the reference the build was measured against.',
    problem:
      'The project had a clear goal and no shape. Starting implementation would have meant designing in the browser and rewriting it repeatedly as the story changed.',
    solution:
      'Storyboarded the sequence end to end — each beat, its purpose, and the transition into the next. Decisions about pacing and emphasis were settled while they were still cheap to change.',
    technologies: ['Figma', 'Motion Design', 'Design Systems'],
    features: [
      { title: 'Narrative sequence', description: 'Every beat mapped with its purpose, in order.' },
      { title: 'Motion direction', description: 'Transitions specified as intent, not decoration.' },
      { title: 'Visual language', description: 'Type, colour and spacing decided once and applied throughout.' },
      { title: 'Build-ready spec', description: 'Handed over in a form an implementer can work from directly.' },
    ],
    challenges: [
      {
        challenge: 'Communicating motion and pacing in a static medium.',
        solution: 'Annotated frames with timing and easing intent, so the feel survived the handoff.',
      },
      {
        challenge: 'Keeping the sequence tight enough to hold attention.',
        solution: 'Cut every beat that did not change what the viewer understood or felt.',
      },
    ],
    process: [
      { step: '01', title: 'Brief', description: 'Established what the piece needed to communicate, and to whom.' },
      { step: '02', title: 'Sequence', description: 'Rough beats in order, testing what the story needs.' },
      { step: '03', title: 'Frames', description: 'Visual direction and composition for each beat.' },
      { step: '04', title: 'Spec', description: 'Motion, timing and handover notes for implementation.' },
    ],
    results: [
      'Implementation started from a decision rather than a blank page',
      'Motion intent documented, so the build matched the direction',
      'Scope settled before it became expensive to change',
    ],
    thumbnail: getProjectMedia('klyra-storyboard').thumbnail,
    gallery: getProjectMedia('klyra-storyboard').gallery,
    githubUrl: '',
    liveUrl: '',
    featured: true,
  },
  {
    id: 'dashboard',
    slug: 'dashboard',
    title: 'Dashboard Project',
    category: 'Data Interface',
    filters: ['web-apps', 'frontend', 'ui-ux'],
    year: 2024,
    status: 'in-development',
    role: 'Frontend Development & UI Design',
    duration: '8 weeks',
    shortDescription:
      'An analytics interface built around what a user needs to decide, rather than around every metric the database can return.',
    longDescription:
      'Most dashboards fail by showing everything. This one starts from the questions a user actually opens it to answer, and puts those answers first — with the detail available but not competing.',
    problem:
      'Dense data interfaces tend to present every available metric at equal weight, which leaves the user to do the prioritising the interface should have done.',
    solution:
      'A clear hierarchy: headline figures, then trend, then breakdown. Charts share one visual language so a reader learns to interpret them once, and dense tables stay legible with tabular figures and restrained rules.',
    technologies: ['React', 'JavaScript', 'Tailwind CSS', 'Node.js'],
    features: [
      { title: 'Prioritised layout', description: 'Headline metrics first; detail available without demanding attention.' },
      { title: 'Consistent chart language', description: 'One set of rules for colour, axes and labelling across every view.' },
      { title: 'Readable dense tables', description: 'Tabular figures and minimal rules, so rows scan cleanly.' },
      { title: 'Responsive breakdown', description: 'Wide tables degrade to a stacked layout instead of scrolling sideways.' },
    ],
    challenges: [
      {
        challenge: 'Data-dense views became unreadable below tablet width.',
        solution: 'Tables collapse to labelled stacks on narrow screens rather than forcing a horizontal scroll.',
      },
      {
        challenge: 'Re-rendering large lists on every filter change dropped frames.',
        solution: 'Memoised rows and derived state, so a filter change touches only what it actually affects.',
      },
    ],
    process: [
      { step: '01', title: 'Questions', description: 'Listed what a user opens the dashboard to find out.' },
      { step: '02', title: 'Hierarchy', description: 'Ranked every metric against those questions.' },
      { step: '03', title: 'System', description: 'One chart and table language applied across all views.' },
      { step: '04', title: 'Performance', description: 'Profiled interaction cost and removed avoidable renders.' },
    ],
    results: [
      'Headline answers readable without scrolling',
      'One chart language across every view',
      'Filter interactions stay responsive on large datasets',
    ],
    thumbnail: getProjectMedia('dashboard').thumbnail,
    gallery: getProjectMedia('dashboard').gallery,
    githubUrl: '',
    liveUrl: '',
    featured: false,
  },
  {
    id: 'exmo',
    slug: 'exmo',
    title: 'EXMO Project',
    category: 'Web App',
    filters: ['web-apps', 'frontend'],
    year: 2024,
    status: 'in-development',
    role: 'PLACEHOLDER — what you actually did',
    duration: 'PLACEHOLDER',
    shortDescription:
      'PLACEHOLDER — describe EXMO in one or two sentences: what it is, who it is for, and what it does that matters.',
    longDescription:
      'PLACEHOLDER — the opening paragraph of the case study. Nothing is written here because the project was named without context, and inventing a description of your own work would be worse than an obvious gap. Replace every field in this record.',
    problem: 'PLACEHOLDER — what was wrong, or missing, before this existed.',
    solution: 'PLACEHOLDER — what you built, and why you built it that way.',
    technologies: ['React', 'JavaScript'],
    features: [
      { title: 'PLACEHOLDER', description: 'Describe a capability and why it matters to the user.' },
      { title: 'PLACEHOLDER', description: 'Three or four features is enough — pick the ones that differentiate it.' },
    ],
    challenges: [
      {
        challenge: 'PLACEHOLDER — a real problem you hit.',
        solution: 'PLACEHOLDER — how you resolved it. This pairing is the most convincing part of a case study.',
      },
    ],
    process: [
      { step: '01', title: 'PLACEHOLDER', description: 'How the work started.' },
      { step: '02', title: 'PLACEHOLDER', description: 'How it took shape.' },
      { step: '03', title: 'PLACEHOLDER', description: 'How it shipped.' },
    ],
    results: ['PLACEHOLDER — a qualitative outcome. Use a number only if you measured one.'],
    thumbnail: getProjectMedia('exmo').thumbnail,
    gallery: getProjectMedia('exmo').gallery,
    githubUrl: '',
    liveUrl: '',
    featured: false,
  },

  {
    id: 'ev-charger-finder',
    slug: 'ev-charger-finder',
    title: 'EV Charger Finder',
    category: 'PLACEHOLDER — Web App / Mobile Web',
    filters: ['web-apps'],
    year: 2026,
    status: 'concept',
    // ⚠️ ADDED ON REQUEST, AND ENTIRELY UNFILLED.
    //
    // This record was previously removed at your instruction — you said you had
    // not built an EV charging project. It is back because you asked for a case
    // study for it twice since, so the slot exists and the route resolves.
    //
    // Nothing is written in. Every field is a placeholder, there is no entry in
    // `media.js`, and the case study renders empty frames describing what belongs
    // in them. Inventing a plausible EV charging app — a map, a filter for
    // connector types, a "40% faster to find a charger" — would be fabricating
    // work you have not done, which is the line this file does not cross.
    //
    // Fill it in, or delete this record and `case-studies/data/ev-charger-finder.js`
    // together. A project a recruiter asks about and you cannot describe is worse
    // than one fewer project.
    role: 'PLACEHOLDER — what you actually did',
    duration: 'PLACEHOLDER',
    shortDescription:
      'PLACEHOLDER — one or two sentences: what it is, who it is for, and what it does that matters.',
    longDescription:
      'PLACEHOLDER — the opening paragraph of the case study. Nothing is written here because no description of this project exists anywhere in the codebase.',
    problem: 'PLACEHOLDER — what was wrong, or missing, before this existed.',
    solution: 'PLACEHOLDER — what you built, and why you built it that way.',
    technologies: ['PLACEHOLDER'],
    features: [
      { title: 'PLACEHOLDER', description: 'A capability, and why it matters to the user.' },
      { title: 'PLACEHOLDER', description: 'Three or four is enough — pick what differentiates it.' },
    ],
    challenges: [
      {
        challenge: 'PLACEHOLDER — a real problem you hit.',
        solution: 'PLACEHOLDER — how you resolved it.',
      },
    ],
    process: [
      { step: '01', title: 'PLACEHOLDER', description: 'How the work started.' },
      { step: '02', title: 'PLACEHOLDER', description: 'How it took shape.' },
      { step: '03', title: 'PLACEHOLDER', description: 'How it shipped.' },
    ],
    results: ['PLACEHOLDER — a qualitative outcome. Use a number only if you measured one.'],
    thumbnail: getProjectMedia('ev-charger-finder').thumbnail,
    gallery: getProjectMedia('ev-charger-finder').gallery,
    githubUrl: '',
    liveUrl: '',
    featured: false,
  },
]

/**
 * Newest first.
 *
 * Sorts a *copy* — `Array.prototype.sort` mutates in place, and reordering the
 * exported array would corrupt it for every other importer.
 *
 * @type {Project[]}
 */
export const PROJECTS_SORTED = [...PROJECTS].sort((a, b) => b.year - a.year)

/** @type {Project[]} */
export const FEATURED_PROJECTS = PROJECTS_SORTED.filter((project) => project.featured)

/**
 * Look up one project — for a future `/work/:slug` route.
 *
 * @param {string} slug
 * @returns {Project|undefined} Undefined for an unknown slug; the route should
 *   render a 404 rather than an empty page.
 */
export function getProjectBySlug(slug) {
  return PROJECTS.find((project) => project.slug === slug)
}

/**
 * Projects matching a filter id. `all` returns everything.
 *
 * Lives beside the data rather than in a component, so "what does this filter
 * mean" is answered once.
 *
 * @param {string} filterId
 * @returns {Project[]}
 */
export function getProjectsByFilter(filterId) {
  if (filterId === 'all') return PROJECTS_SORTED
  return PROJECTS_SORTED.filter((project) => project.filters.includes(filterId))
}
