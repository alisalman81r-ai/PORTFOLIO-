import { defineCaseStudy, resolveGallery } from './schema'
import { getProjectBySlug } from '@/data'

const project = getProjectBySlug('exmo')

/**
 * EXMO — case study template.
 *
 * ⚠️ NOTHING HERE IS WRITTEN, AND THAT IS DELIBERATE.
 *
 * `projects.js` carries this project with every field marked PLACEHOLDER,
 * because it was named without context. No description, screenshot, repository
 * or stack detail for it exists anywhere in this codebase.
 *
 * The structure below is complete, so filling it in is a matter of replacing
 * strings rather than designing a page. But the strings are questions, not
 * guesses: a plausible-sounding case study about a project nobody can describe
 * is the single worst thing a portfolio can contain, because it is the one a
 * recruiter will ask about.
 *
 * `draft: true` puts a visible banner on the page. Remove it when the content
 * is real — or delete this file and the record in `projects.js` together.
 */
export const exmo = defineCaseStudy('exmo', {
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
      'PLACEHOLDER — two or three sentences. What EXMO is, who it is for, and what it does that matters.',
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
