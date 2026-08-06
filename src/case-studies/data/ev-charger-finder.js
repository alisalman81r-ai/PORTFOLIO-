import { defineCaseStudy, resolveGallery } from './schema'
import { getProjectBySlug } from '@/data'

const project = getProjectBySlug('ev-charger-finder')

/**
 * EV Charger Finder — case study template.
 *
 * ⚠️ NOTHING HERE IS WRITTEN, AND THAT IS DELIBERATE.
 *
 * You told me earlier that you had not built an EV charging project and asked
 * for it to be removed. It is back because you have since asked for a case
 * study for it twice, so the route resolves and the structure exists.
 *
 * What does not exist is any description, stack, screenshot or repository for
 * it anywhere in this codebase — and there is no entry in `media.js` either, so
 * the gallery renders empty frames rather than stock photographs of charging
 * stations. A page that looks like evidence of work that has not been shown is
 * worse than an obviously unfinished one.
 *
 * Fill it in, or delete this file together with the record in `projects.js`.
 * `draft: true` puts a visible banner on the page until then.
 */
export const evChargerFinder = defineCaseStudy('ev-charger-finder', {
  draft: true,

  hero: {
    statement: 'PLACEHOLDER — one line: the thesis of the project, not a description of it.',
    ctas: [
      { label: 'View live', href: project.liveUrl, icon: 'external', variant: 'primary' },
      { label: 'Source', href: project.githubUrl, icon: 'code', variant: 'outline' },
    ],
  },

  overview: {
    summary:
      'PLACEHOLDER — two or three sentences. What it is, who it is for, and what it does that matters.',
    detail: [
      'PLACEHOLDER — the opening paragraph. What existed before, and what prompted this.',
      'PLACEHOLDER — what you built, at the level a client would understand.',
      'PLACEHOLDER — what changed as a result.',
    ].join('\n\n'),
    businessGoal:
      'PLACEHOLDER — what the work was supposed to achieve. Not what it was built with.',
    facts: [
      { label: 'Client', value: 'PLACEHOLDER — or "Self-directed"' },
      { label: 'Engagement', value: 'PLACEHOLDER' },
      { label: 'Team', value: 'PLACEHOLDER — solo, or your role in a team' },
      { label: 'Platform', value: 'PLACEHOLDER' },
    ],
  },

  problem: {
    what: 'PLACEHOLDER — the problem itself, stated plainly.',
    who: 'PLACEHOLDER — who experienced it. Be specific; "users" is a way of avoiding naming an audience.',
    why: 'PLACEHOLDER — why it mattered, and what it cost to leave alone.',
    evidence: [
      'PLACEHOLDER — what told you the problem was real. Observations, not statistics, unless you measured them.',
    ],
  },

  solution: {
    approach: 'PLACEHOLDER — how the solution works, in plain terms.',
    designThinking: 'PLACEHOLDER — the reasoning behind the design decisions.',
    strategy: 'PLACEHOLDER — the development strategy, and why that order.',
    principles: [
      {
        title: 'PLACEHOLDER',
        description: 'A rule the project held to, and what it ruled out.',
        icon: 'target',
      },
      {
        title: 'PLACEHOLDER',
        description: 'Two or three is enough — these should be decisions, not values.',
        icon: 'layers',
      },
    ],
  },

  design: [
    {
      id: 'planning',
      label: 'Planning',
      icon: 'planning',
      description: 'PLACEHOLDER — how the work was scoped, and what was ruled out early.',
      points: ['PLACEHOLDER'],
    },
    {
      id: 'research',
      label: 'Research',
      icon: 'discovery',
      description: 'PLACEHOLDER — what you looked at, and what it changed.',
      points: ['PLACEHOLDER'],
    },
    {
      id: 'wireframes',
      label: 'Wireframes',
      icon: 'storyboard',
      description: 'PLACEHOLDER — what was resolved at low fidelity before any visual design.',
      image: null,
      imageHint: 'Wireframe export',
    },
    {
      id: 'ui',
      label: 'UI Design',
      icon: 'palette',
      description: 'PLACEHOLDER — the visual system, and the constraint it was built against.',
      points: ['PLACEHOLDER'],
      image: null,
      imageHint: 'UI kit or key screen',
    },
    {
      id: 'ux',
      label: 'UX Decisions',
      icon: 'process',
      description: 'PLACEHOLDER — the decisions a user feels but never sees.',
      points: ['PLACEHOLDER'],
    },
  ],

  development: {
    architecture: 'PLACEHOLDER — how the pieces fit together, and why that shape.',
    frontend: 'PLACEHOLDER — the framework, and how state and layout are organised.',
    backend: 'PLACEHOLDER — or null if there is no backend.',
    database: 'PLACEHOLDER — or null.',
    api: 'PLACEHOLDER — the contract, and how errors surface in the interface. Or null.',
    deployment: 'PLACEHOLDER — where it runs, and how a change reaches it.',
    decisions: ['PLACEHOLDER — a notable call, and the trade-off it accepted.'],
  },

  challenges: [
    {
      kind: 'technical',
      items: [
        {
          challenge: 'PLACEHOLDER — a real problem you hit.',
          solution:
            'PLACEHOLDER — how you resolved it. This pairing is the most convincing thing on the page.',
        },
      ],
    },
    {
      kind: 'design',
      items: [
        { challenge: 'PLACEHOLDER', solution: 'PLACEHOLDER' },
      ],
    },
    {
      kind: 'performance',
      items: [
        { challenge: 'PLACEHOLDER', solution: 'PLACEHOLDER' },
      ],
    },
  ],

  results: {
    impact: ['PLACEHOLDER — a qualitative outcome.'],
    performance: ['PLACEHOLDER — measured figures only. Delete this line if you measured nothing.'],
    lessons: [
      'PLACEHOLDER — what you would do differently. This section is worth more than the impact list; it is the one that reads as experience rather than as marketing.',
    ],
    metrics: [],
  },

  gallery: resolveGallery(project, [
    { caption: 'PLACEHOLDER — what this screen shows', hint: 'Screenshot: primary view' },
    { caption: 'PLACEHOLDER', hint: 'Screenshot: secondary view' },
    { caption: 'PLACEHOLDER', hint: 'Screenshot: mobile' },
  ]),

  future: [
    'PLACEHOLDER — what you would add next, and why it is not there yet.',
  ],
})
