import { defineCaseStudy, resolveGallery } from './schema'
import { getProjectBySlug } from '@/data'

const project = getProjectBySlug('dashboard')

/**
 * Analytics Dashboard — full case study.
 *
 * ⚠️ THE PROJECT IS MARKED `in-development` IN `projects.js`, AND THE PAGE SAYS
 * SO. Results are written as what the approach achieves, not as outcomes
 * measured in production, because it has not been in production. Anything that
 * would need a real user or a real dataset behind it is a placeholder.
 */
export const dashboard = defineCaseStudy('dashboard', {
  hero: {
    statement:
      'The numbers were all present. The answer was not.',
    ctas: [
      { label: 'View live', href: project.liveUrl, icon: 'external', variant: 'primary' },
      { label: 'Source', href: project.githubUrl, icon: 'code', variant: 'outline' },
    ],
  },

  overview: {
    summary:
      'A data interface built around what someone opens a dashboard to find out, rather than around what the data happens to contain.',
    detail: [
      'Most dashboards are organised by data source. Whatever the system can report becomes a panel, panels get arranged until they fit, and the result is a screen where everything is visible and nothing is answered.',
      'This one was built the other way around. The first artefact was a list of the questions a user actually opens the screen to settle — is anything wrong, is the trend holding, where is the outlier — and every metric was then ranked against those questions rather than against how interesting it was to plot.',
      'What that changes is hierarchy. Headline figures get size and position; supporting detail stays available without demanding attention; and one consistent chart language runs across every view, so a pattern means the same thing wherever it appears.',
    ].join('\n\n'),
    businessGoal:
      'Cut the time between opening the screen and knowing whether anything needs acting on.',
    facts: [
      { label: 'Type', value: 'Self-directed' },
      { label: 'Status', value: 'In development' },
      { label: 'Team', value: 'Solo — design and build' },
      { label: 'Data', value: 'PLACEHOLDER — real source, or generated fixtures' },
    ],
  },

  problem: {
    what: 'Dense metrics and tables become unreadable when everything carries equal weight. The figures are all on screen and the question the user came with still takes minutes to answer.',
    who: 'Anyone who opens a dashboard on a schedule rather than out of curiosity — the person checking whether today looks like yesterday, who needs an answer in seconds and gets a wall of panels instead.',
    why: 'A dashboard that takes five minutes to read stops being opened. The data keeps being collected and stops being used, which is a worse outcome than not having built it.',
    evidence: [
      'Panels typically arranged by data source rather than by question',
      'Wide tables that scroll sideways on anything narrower than a desktop',
      'PLACEHOLDER — observations from watching someone actually use one',
    ],
  },

  solution: {
    approach:
      'Rank every metric against the questions users open the dashboard to answer, then give the top of that ranking the size and position. Everything else remains reachable without competing for attention.',
    designThinking:
      'Hierarchy is the whole product here. A chart is not information until it is placed — the same figure at the top of a screen and in the fourth panel of a grid carries completely different weight. Consistency does the rest: one set of rules for colour, axes and labelling means a reader learns the language once instead of re-reading every panel.',
    strategy:
      'Questions first, then hierarchy, then a single chart system, then performance. Profiling was left until the interface was settled, because optimising a layout that is about to change is work thrown away.',
    principles: [
      {
        title: 'Rank by question, not by source',
        description:
          'Every metric earns its position by how directly it answers something a user came to find out.',
        icon: 'target',
      },
      {
        title: 'One chart language',
        description:
          'Colour, axes and labelling follow the same rules everywhere, so a pattern reads identically across views.',
        icon: 'results',
      },
      {
        title: 'Density without noise',
        description:
          'Tabular figures and minimal rules, so a dense table scans cleanly instead of turning into a grid of boxes.',
        icon: 'layers',
      },
    ],
  },

  design: [
    {
      id: 'questions',
      label: 'Planning',
      icon: 'planning',
      description:
        'Listed what a user opens the dashboard to find out. Short list, written as questions rather than as metric names — the difference matters, because a metric name assumes the answer is already known.',
      points: [
        'Wrote the questions before looking at what data existed',
        'Ruled out metrics that answered none of them',
      ],
    },
    {
      id: 'research',
      label: 'Research',
      icon: 'discovery',
      description:
        'Reviewed how dense data interfaces handle scanning: tabular figures, restrained rules, and the point at which a table stops being readable and needs a different shape entirely.',
      points: [
        'Studied typographic conventions for figures in tables',
        'Identified where sideways scrolling becomes unavoidable, and what to do instead',
      ],
    },
    {
      id: 'wireframes',
      label: 'Wireframes',
      icon: 'storyboard',
      description:
        'Layout resolved as blocks and weights before a single chart was drawn, so the argument about hierarchy happened while it was still free to lose.',
      image: null,
      imageHint: 'Wireframe — dashboard grid and hierarchy',
    },
    {
      id: 'ui',
      label: 'UI Design',
      icon: 'palette',
      description:
        'One chart language applied across every view. Colour carries meaning rather than variety, axes are labelled the same way everywhere, and the type scale distinguishes headline figures from supporting ones without shouting.',
      points: [
        'Colour assigned by meaning, and reused consistently',
        'Tabular figures throughout, so columns align on the digit',
        'Chart chrome reduced until only what is read remains',
      ],
      image: null,
      imageHint: 'Chart system — colour, axes, labelling rules',
    },
    {
      id: 'ux',
      label: 'UX Decisions',
      icon: 'process',
      description:
        'Wide tables degrade to a stacked layout rather than scrolling sideways, and headline metrics stay visible while detail is explored. Nothing important is behind an interaction.',
      points: [
        'No horizontal scrolling — wide tables stack instead',
        'Headline figures remain in view while filtering',
        'Loading and empty states designed, not left to chance',
      ],
    },
  ],

  development: {
    architecture:
      'Component-driven, with chart configuration held as data rather than as props scattered through the tree. A new view composes existing pieces and inherits the chart language automatically.',
    frontend:
      'React with Tailwind CSS. State kept deliberately shallow — filters live at the level that owns the view, so a change re-renders the panel that cares and nothing above it.',
    backend:
      'Node.js for the data layer. PLACEHOLDER — describe what it actually serves: aggregation, a proxy to another service, or fixtures for development.',
    database: 'PLACEHOLDER — the store behind it, or "None — reads from an upstream API".',
    api: 'PLACEHOLDER — the shape of the contract: endpoints, polling or push, and how errors surface in the interface.',
    deployment: 'PLACEHOLDER — where it runs, and how a change reaches it.',
    decisions: [
      'Profiled interaction cost and removed avoidable re-renders, rather than reaching for memoisation everywhere and hoping',
      'Chart configuration kept as data, so a new view cannot quietly invent its own visual language',
      'Wide tables restructured rather than made scrollable — a horizontal scrollbar is a layout that gave up',
    ],
  },

  challenges: [
    {
      kind: 'technical',
      items: [
        {
          challenge: 'Interaction cost climbs quickly as views and filters multiply.',
          solution:
            'Profiled the actual cost and removed avoidable re-renders at the source, instead of wrapping components in memoisation until the symptom went away.',
        },
      ],
    },
    {
      kind: 'design',
      items: [
        {
          challenge:
            'Every stakeholder wants their metric at the top, and every one of them has a reason.',
          solution:
            'Ranked against the written list of questions rather than against preference, which moved the conversation from taste to evidence.',
        },
        {
          challenge: 'Dense tables become unreadable exactly when they become useful.',
          solution:
            'Tabular figures and minimal rules, so rows scan on the numbers rather than on the lines between them.',
        },
      ],
    },
    {
      kind: 'performance',
      items: [
        {
          challenge:
            'Charts re-render on every filter change, and several of them are expensive.',
          solution:
            'Scoped state to the panel that owns it, so a filter change costs one panel rather than the page.',
        },
      ],
    },
  ],

  results: {
    impact: [
      'Headline answers are readable without interrogating the interface',
      'One chart and table language across all views, so patterns read the same everywhere',
      'Wide tables stay usable on narrow screens instead of scrolling sideways',
    ],
    performance: [
      'PLACEHOLDER — profile it and record real figures. This project is still in development; nothing measured is claimed here.',
    ],
    lessons: [
      'Writing the questions before looking at the data changed which metrics survived. Several that were obviously worth plotting answered nothing anyone had asked.',
      'Profiling before optimising found the actual cost in one place. The memoisation that would have been added on instinct would have addressed none of it.',
      'Next time: design the empty and loading states alongside the populated one. Retrofitting them is where most dashboard interfaces start to look unfinished.',
    ],
    metrics: [],
  },

  gallery: resolveGallery(project, [
    { caption: 'Overview — headline metrics first', hint: 'Screenshot: dashboard overview' },
    { caption: 'Detail view with the chart language applied', hint: 'Screenshot: detail view' },
    { caption: 'Dense table, kept scannable', hint: 'Screenshot: table view' },
    { caption: 'Stacked layout at narrow widths', hint: 'Screenshot: mobile' },
  ]),

  future: [
    'Saved views, so a user returns to the question they were asking rather than the default',
    'Threshold alerts, so the routine check becomes an exception check',
    'Keyboard navigation through panels and tables for faster scanning',
    'PLACEHOLDER — what the first real users ask for once it ships',
  ],
})
