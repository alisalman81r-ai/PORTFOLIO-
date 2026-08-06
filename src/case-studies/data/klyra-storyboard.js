import { defineCaseStudy, resolveGallery } from './schema'
import { getProjectBySlug } from '@/data'

const project = getProjectBySlug('klyra-storyboard')

/**
 * Storyboard Design — Klyra. Full case study.
 *
 * ⚠️ THIS ONE NAMES A CLIENT. Klyra comes from your own account of the work and
 * is already published in `experience.js` and `projects.js`. Everything else
 * about the engagement — its value, its duration, what it was for — is either
 * marked as a placeholder or left out. Confirm Klyra are happy to be named
 * before this page goes public; a client who expected discretion finding
 * themselves in a portfolio is a hard conversation to have afterwards.
 *
 * NOTE ON MISSING SECTIONS. This was direction and specification work, not a
 * build. `development` is `null` rather than filled with placeholders, and the
 * renderer omits the section entirely — an absent Development section says
 * "this was a design engagement", which is true and worth saying.
 */
export const klyraStoryboard = defineCaseStudy('klyra-storyboard', {
  hero: {
    statement:
      'Production was about to begin from a blank page. The most expensive place to still be deciding the story.',
    ctas: [
      { label: 'View the work', href: project.liveUrl, icon: 'external', variant: 'primary' },
    ],
  },

  overview: {
    summary:
      'Narrative and visual direction for a client piece: the sequence, the pacing and the motion intent worked out and specified before anyone opened a code editor.',
    detail: [
      'A storyboard is not decoration for a project plan. It is the point at which a piece stops being an intention and becomes a set of decisions someone can build — and if those decisions are not made here, they get made later, by whoever is implementing, under deadline, one frame at a time.',
      'The brief was a piece that had to communicate something specific to a specific audience, with production ready to start. What did not exist was the shape: which beats, in what order, at what pace, and what each one was actually for.',
      'The work was to establish that shape and hand it over in a form an implementer could build from directly. Not a mood board and not a description — a sequence, with the purpose of every beat stated and the motion specified as intent rather than adjectives.',
    ].join('\n\n'),
    businessGoal:
      'Let production start from a settled sequence rather than a blank page, and settle the scope while changing it was still cheap.',
    facts: [
      { label: 'Client', value: 'Klyra' },
      { label: 'Discipline', value: 'Creative direction & storyboarding' },
      { label: 'Deliverable', value: 'Build-ready specification' },
      { label: 'Engagement', value: 'PLACEHOLDER — fixed price / day rate' },
    ],
  },

  problem: {
    what: 'The piece had no agreed sequence. Story, pacing and motion were all still open with production about to begin, which meant those decisions would be made during implementation — the slowest and most expensive place to make them.',
    who: 'The implementation team, who would otherwise be inventing narrative structure while also building it, and the client, who would be reviewing a moving target.',
    why: 'Changing a beat on a whiteboard costs an afternoon. Changing it after it has been built costs the build. Deciding late does not avoid the decision, it just raises the price.',
    evidence: [
      'Production scheduled to start against an undefined sequence',
      'PLACEHOLDER — what the client said about previous projects that ran over',
    ],
  },

  solution: {
    approach:
      'Mapped the piece beat by beat, with the purpose of each beat written next to it. Anything that could not justify its place came out. What remained was specified: visual language, timing, and the intent behind every transition.',
    designThinking:
      'A beat that cannot say what it is for is decoration, and decoration is what gets cut first under deadline — usually badly. Writing the purpose beside each frame made the sequence self-auditing: the weak beats identified themselves, and the argument about whether to keep one happened in a document rather than in a build.',
    strategy:
      'Rough the whole sequence before refining any of it. A polished opening against an undecided middle is the most common way a piece like this fails, because the polish makes the opening expensive to change once the middle finally forces it to.',
    principles: [
      {
        title: 'Every beat states its purpose',
        description:
          'Written beside the frame, not implied by it. A beat that needs explaining in a meeting will need explaining to the audience too.',
        icon: 'target',
      },
      {
        title: 'Motion as intent, not adjectives',
        description:
          'Timing, easing and direction specified per transition, so the implementer inherits decisions rather than a mood.',
        icon: 'sparkles',
      },
      {
        title: 'Decide while it is cheap',
        description:
          'Every question resolved on paper is one not resolved against a deadline with a build already half-finished.',
        icon: 'planning',
      },
    ],
  },

  design: [
    {
      id: 'brief',
      label: 'Planning',
      icon: 'planning',
      description:
        'Established what the piece needed to communicate, to whom, and what a viewer should be able to do or believe by the end of it. Everything after this was measured against that sentence.',
      points: [
        'Defined the single thing the piece had to land',
        'Agreed the audience precisely enough to rule things out',
        'Set the running length before writing to it',
      ],
    },
    {
      id: 'research',
      label: 'Research',
      icon: 'discovery',
      description:
        'Looked at how comparable pieces handle pacing — specifically where attention is usually lost, which is earlier and more consistently than most sequences assume.',
      points: [
        'Reviewed reference pieces for beat length and transition density',
        'Noted where attention typically drops, and shortened the opening accordingly',
      ],
    },
    {
      id: 'sequence',
      label: 'Wireframes',
      icon: 'storyboard',
      description:
        'Rough beats in order, at low fidelity and deliberately ugly, so the conversation stayed about the sequence rather than the styling of any one frame.',
      image: null,
      imageHint: 'Storyboard sheet — rough beats in sequence',
    },
    {
      id: 'frames',
      label: 'UI Design',
      icon: 'palette',
      description:
        'Visual direction and composition per beat: type, colour and spacing decided once and applied throughout, so the piece reads as one object rather than a series of frames that happen to follow each other.',
      points: [
        'One type and colour system across every frame',
        'Composition resolved per beat, against the sequence rather than in isolation',
      ],
      image: null,
      imageHint: 'Frame designs — final visual direction',
    },
    {
      id: 'spec',
      label: 'UX Decisions',
      icon: 'process',
      description:
        'Motion, timing and handover notes written for implementation. The specification names what each transition is doing and why, which is what lets an implementer make a judgement call correctly when reality differs from the board.',
      points: [
        'Timing and easing specified per transition',
        'Handover notes written for the person building, not for the client',
      ],
    },
  ],

  // Direction and specification, not a build. The renderer omits this section
  // rather than showing it empty — see the note in `schema.js`.
  development: null,

  challenges: [
    {
      kind: 'design',
      items: [
        {
          challenge: 'Motion intent is easy to describe vaguely and hard to hand over.',
          solution:
            'Specified timing, easing and purpose per transition, so the implementer inherited decisions rather than adjectives.',
        },
        {
          challenge:
            'A sequence reviewed frame by frame gets approved beat by beat, and then does not work as a whole.',
          solution:
            'Reviewed the rough sequence end to end before any frame was refined, so pacing was judged as pacing rather than as a series of pictures.',
        },
      ],
    },
    {
      kind: 'technical',
      items: [
        {
          challenge:
            'A specification an implementer cannot act on is a document, not a deliverable.',
          solution:
            'Wrote it against what the build would actually need — order, duration, intent — and left presentation notes out of it.',
        },
      ],
    },
  ],

  results: {
    impact: [
      'Implementation began from a settled sequence rather than a blank page',
      'Scope was agreed while changes were still cheap',
      'Motion intent was handed over in a form that could be built from directly',
    ],
    performance: [],
    lessons: [
      'Writing the purpose beside each beat did more than any review meeting. The weak beats identified themselves and the argument stopped being a matter of taste.',
      'Roughing the whole sequence before refining any of it is uncomfortable and correct — polish invested early is polish you will defend when it should be cut.',
      'Next time: agree the running length before writing to it. Length decided afterwards is length decided by whatever was already drawn.',
    ],
    metrics: [],
  },

  gallery: resolveGallery(project, [
    { caption: 'Sequence overview — every beat in order', hint: 'Storyboard sheet' },
    { caption: 'Frame direction — type, colour and composition', hint: 'Frame design' },
    { caption: 'Motion specification', hint: 'Spec page or annotated frame' },
    { caption: 'Handover notes', hint: 'Documentation extract' },
  ]),

  future: [
    'An animated pre-visualisation, so pacing can be judged in time rather than on paper',
    'A reusable frame template, so the next piece starts from a system instead of a blank sheet',
    'PLACEHOLDER — whether Klyra took this into production, and what changed when they did',
  ],
})
