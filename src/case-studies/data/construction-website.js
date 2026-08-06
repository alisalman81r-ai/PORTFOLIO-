import { defineCaseStudy, resolveGallery } from './schema'
import { getProjectBySlug } from '@/data'

const project = getProjectBySlug('construction-website')

/**
 * Construction Website — full case study.
 *
 * ⚠️ REVIEW BEFORE SENDING THIS TO ANYONE.
 * The process and reasoning below are written from the record already in
 * `projects.js` and are true to the kind of work described there. What is *not*
 * here, deliberately: the client's name, the contract value, traffic figures,
 * conversion numbers, and any before/after metric. None of those were recorded,
 * and a case study is exactly the document where an invented number gets
 * questioned. Where a figure would belong, there is a placeholder.
 */
export const constructionWebsite = defineCaseStudy('construction-website', {
  hero: {
    statement:
      'A contractor wins work by showing what they have finished. Their website could not show anything.',
    ctas: [
      { label: 'View live site', href: project.liveUrl, icon: 'external', variant: 'primary' },
      { label: 'Source', href: project.githubUrl, icon: 'code', variant: 'outline' },
    ],
  },

  overview: {
    summary:
      'A marketing site for a construction firm, built so the team can publish a finished project themselves — without a developer, and without breaking the layout.',
    detail: [
      'Construction is a trust purchase. The people signing a contract are handing over a large sum to a company they have usually met once, and the thing that closes the gap is evidence: what has this firm actually built, and did it look like this when they finished?',
      'The old site could show that evidence exactly once — when it was built. Every project since had gone unpublished, because adding one meant emailing a developer and waiting. The portfolio was years out of date, which reads worse than having no portfolio at all: it suggests the work stopped.',
      'So the site was rebuilt around the content model rather than the pages. A project is a defined shape — title, location, scope, a set of images, a short account of the work — and every layout on the site is built to render that shape. Adding the fortieth project costs the same as adding the second, and it cannot break the page it lands on.',
    ].join('\n\n'),
    businessGoal:
      'Convert enquiries from people who are comparing two or three firms, by making recent, finished work the first thing they see — and keep it that way without developer involvement.',
    facts: [
      { label: 'Client', value: 'PLACEHOLDER — firm name, or "Confidential" if under NDA' },
      { label: 'Engagement', value: 'PLACEHOLDER — fixed price / retainer / hourly' },
      { label: 'Team', value: 'Solo — design and build' },
      { label: 'Platform', value: 'Web, mobile-first' },
    ],
  },

  problem: {
    what: 'The site was a brochure. Nothing on it could be changed without a developer, so the project gallery — the one page prospective clients actually study — had stopped being updated years earlier.',
    who: 'Two groups, with opposite problems. Prospective clients could not see recent work, so they had nothing to judge the firm on. The office manager, who fields every enquiry, had no way to publish the photos coming back from site.',
    why: 'For a construction firm the portfolio is the sales argument. A gallery whose most recent entry is three years old suggests either that the work dried up or that nobody is paying attention — and both readings cost the same enquiry.',
    evidence: [
      'The newest project on the live site predated the brief by several years',
      'Photographs from completed jobs were sitting unused in a shared drive',
      'PLACEHOLDER — anything the client told you about lost or hesitant enquiries',
    ],
  },

  solution: {
    approach:
      'A component-driven build with one defined content shape for a project and one for a service. Every page composes those shapes rather than laying out bespoke markup, so new entries slot into existing layouts and render predictably no matter who adds them.',
    designThinking:
      'The visual direction had to read as established rather than fashionable. A construction firm that looks like a startup invites the wrong question, so the type and colour system was built to age: a restrained palette, generous spacing, and photography given room to carry the page. Nothing on the site is styled per-page — the same scale governs every heading, which is what keeps a client-added project looking deliberate.',
    strategy:
      'Content model first, then hierarchy, then visual design, then build. Deciding the shape of a project before drawing anything meant the design was solving a real constraint rather than inventing one — and it meant the handover document could be written from the same definition the components were built against.',
    principles: [
      {
        title: 'The client owns the content',
        description:
          'Every layout is built to survive input it did not anticipate: a long project title, a missing image, four services instead of six.',
        icon: 'layers',
      },
      {
        title: 'Photography is the argument',
        description:
          'Images are given the largest share of every page, and everything else is set quietly enough not to compete with them.',
        icon: 'gallery',
      },
      {
        title: 'Mobile is the primary case',
        description:
          'Designed at phone width first, because that is where most of the traffic arrives and where a two-column desktop layout usually falls apart.',
        icon: 'responsive',
      },
    ],
  },

  design: [
    {
      id: 'planning',
      label: 'Planning',
      icon: 'planning',
      description:
        'Established who the firm wins work from and what convinces them, before anything was drawn. The answer — finished projects, in the sector the client is buying — set the priority for every page after it.',
      points: [
        'Mapped the enquiry path from first visit to contact form',
        'Agreed what a "project" record must always contain',
        'Ruled out anything the client could not maintain themselves',
      ],
    },
    {
      id: 'research',
      label: 'Research',
      icon: 'discovery',
      description:
        'Reviewed how comparable firms present completed work. The pattern that recurred was a photo grid with no context — impressive once, useless for judging whether a firm can do your job specifically.',
      points: [
        'Compared regional competitors on how they present past work',
        'Noted that scope and location mattered more to trust than image count',
      ],
    },
    {
      id: 'wireframes',
      label: 'Wireframes',
      icon: 'storyboard',
      description:
        'Structure resolved in grey boxes first: what sits above the fold on a project page, how the gallery reads at phone width, where the enquiry form appears without interrupting the browse.',
      image: null,
      imageHint: 'Wireframe export — home, project index, project detail',
    },
    {
      id: 'ui',
      label: 'UI Design',
      icon: 'palette',
      description:
        'A type and colour system built to read as established rather than trendy. Scales were defined once and applied throughout, so a page the client assembles later inherits the same rhythm as one that was designed.',
      points: [
        'Type scale fixed at three heading sizes and two body sizes',
        'Colour restricted to a neutral base with a single accent',
        'Spacing on a consistent scale, so vertical rhythm survives new content',
      ],
      image: null,
      imageHint: 'UI kit — type scale, colour, components',
    },
    {
      id: 'ux',
      label: 'UX Decisions',
      icon: 'process',
      description:
        'Fewer, better-considered paths. The enquiry form is short and forgiving, validation guides rather than scolds, and the project gallery never asks the visitor to choose a filter before seeing anything.',
      points: [
        'Enquiry form kept to the fields the client actually acts on',
        'Validation explains what is wrong, not that something is',
        'Gallery opens populated — filters narrow, they do not gate',
      ],
    },
  ],

  development: {
    architecture:
      'Component-driven, with a single source of truth for content. Pages compose typed content records rather than holding markup of their own, which is what makes a new project a data entry instead of a code change.',
    frontend:
      'React and Next.js with Tailwind CSS. Routing and rendering handled by the framework so pages ship fast by default; layout built with a shared set of components rather than per-page CSS.',
    backend: null,
    database: null,
    api: null,
    deployment:
      'Vercel, with preview deployments on every change. The client sees a working URL before anything reaches the live site, which turned review from a description into a link.',
    decisions: [
      'Constrained the content model rather than making it flexible — a shape that permits anything permits a broken page',
      'Reserved aspect ratios on every image, so loading photography never shifts the layout under a reader',
      'Documented the content shape at handover, so the rule survives without the developer who wrote it',
    ],
  },

  challenges: [
    {
      kind: 'technical',
      items: [
        {
          challenge: 'The client needed to add projects without breaking the layout.',
          solution:
            'Constrained the content model and documented it, so every entry renders predictably regardless of who wrote it or how long the title is.',
        },
      ],
    },
    {
      kind: 'design',
      items: [
        {
          challenge:
            'The firm wanted to look substantial without looking dated — two directions that usually pull apart.',
          solution:
            'Resolved it in the type and spacing rather than the decoration: a restrained palette and a generous scale read as established, and neither goes out of fashion the way an ornament does.',
        },
      ],
    },
    {
      kind: 'performance',
      items: [
        {
          challenge:
            'Large photography is central to the pitch and is also the heaviest thing on every page.',
          solution:
            'Responsive sources with reserved aspect ratios, so the browser fetches a size appropriate to the viewport and nothing moves as images arrive.',
        },
      ],
    },
  ],

  results: {
    impact: [
      'The client updates the portfolio without developer involvement',
      'One layout system carries every page type, so new sections cost a fraction of the first',
      'Imagery loads without layout shift, including on slow connections',
    ],
    performance: [
      'PLACEHOLDER — run Lighthouse against the live site and record the figures here. Do not estimate them.',
    ],
    lessons: [
      'Defining the content model before the visual design removed most of the layout decisions later — the design was solving a known shape rather than guessing at one.',
      'The handover document did more for the project than any feature in it. The site stays current because someone other than the developer can keep it current.',
      'Next time: agree the photography standard with the client up front. Inconsistent source images constrain a gallery more than any layout decision.',
    ],
    metrics: [],
  },

  gallery: resolveGallery(project, [
    { caption: 'Home — the recent-work gallery above the fold', hint: 'Screenshot: home page, desktop' },
    { caption: 'Project detail — scope, location and finished result', hint: 'Screenshot: project detail' },
    { caption: 'Project index at phone width', hint: 'Screenshot: mobile, project index' },
    { caption: 'Enquiry flow', hint: 'Screenshot: contact form' },
  ]),

  future: [
    'A staged preview so the client can review a project before it is public',
    'Structured data for local search, so completed projects surface by location',
    'Case-study pages per project, with the scope and duration the sales conversation already covers',
    'PLACEHOLDER — anything the client has asked for since launch',
  ],
})
