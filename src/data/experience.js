/**
 * Professional experience.
 *
 * Not every entry is a job. Self-directed work and continuous learning belong
 * on a timeline that is honest about how a developer actually builds up — and
 * hiding them would leave gaps that look worse than the truth.
 *
 * DATES
 * Prefer ISO `start`/`end` ('2024-03'), which sorts and localises, and let
 * `formatDateRange()` from `@/utils` render it. A null `end` means "Present"
 * and is computed, so a current role never goes stale.
 *
 * Where the real dates are not known yet, `period` is a display-string fallback
 * and the component uses it when `start` is absent. Fill in `start`/`end` and
 * delete `period` — nothing else changes.
 *
 * ⚠️ PLACEHOLDER. The four entries are the ones you named; the periods are
 * `20XX` because the real dates are yours and inventing them would put
 * fabricated claims on a page recruiters read. Descriptions are generic
 * scaffolding shaped to each entry type.
 */

export const EXPERIENCE_META = {
  badge: 'Experience',
  headline: [{ text: 'Where the' }, { text: 'hours went', accent: true }],
  intro:
    'Client work, self-directed projects, and the deliberate practice in between. Listed in the order it happened.',
}

/**
 * @typedef {object} ExperienceEntry
 * @property {string} id
 * @property {string} role         Title, or what the entry is.
 * @property {string} context      Employer, client, or the nature of the work.
 * @property {string} [period]     Display fallback when `start` is unknown.
 * @property {string} [start]      ISO 'YYYY-MM'. Preferred — sorts and localises.
 * @property {string|null} [end]   ISO 'YYYY-MM', or null for ongoing.
 * @property {'freelance'|'personal'|'client'|'learning'} type
 * @property {string} description  Two or three sentences on scope and ownership.
 * @property {string[]} highlights Bullets. Lead with impact, not responsibility.
 * @property {string[]} technologies
 * @property {boolean} [current]   Highlights the node and marks it as ongoing.
 */

/**
 * Type badges. Declared here so the vocabulary sits beside the data using it.
 */
export const EXPERIENCE_TYPES = {
  freelance: { label: 'Freelance', tone: 'accent' },
  client: { label: 'Client work', tone: 'default' },
  personal: { label: 'Self-directed', tone: 'outline' },
  learning: { label: 'Ongoing', tone: 'outline' },
}

/** @type {ExperienceEntry[]} */
export const EXPERIENCE = [
  {
    id: 'freelance',
    role: 'Freelance Web Developer',
    context: 'Independent',
    period: '20XX — Present',
    type: 'freelance',
    current: true,
    description:
      'Building and shipping websites and web apps for clients directly — scoping the work, designing the structure, writing the code, and handing over something the client can maintain.',
    highlights: [
      'Own projects end to end, from first conversation to deployment',
      'Translate business goals into scope a fixed budget can actually cover',
      'Hand over documentation, not just a repository',
    ],
    technologies: ['React', 'Next.js', 'Tailwind CSS', 'Node.js', 'Vercel'],
  },
  {
    id: 'client-storyboard',
    role: 'Client Storyboard Project',
    context: 'Klyra',
    period: '20XX',
    type: 'client',
    description:
      'Narrative and visual direction for a client project — mapping the sequence, pacing and motion intent before implementation started, so the build began from a decision rather than a blank page.',
    highlights: [
      'Defined the beat-by-beat sequence and its purpose',
      'Specified motion intent in a form an implementer could work from',
      'Settled scope while it was still cheap to change',
    ],
    technologies: ['Figma', 'Motion Design', 'Design Systems'],
  },
  {
    id: 'personal-projects',
    role: 'Personal Projects',
    context: 'Self-directed',
    period: '20XX — Present',
    type: 'personal',
    description:
      'Projects built to learn something specific rather than to a brief. Where I try the approach that would be too risky to trial on a client deadline.',
    highlights: [
      'Full ownership of architecture decisions and their consequences',
      'Where new tools get evaluated before they reach client work',
      'Several became the case studies in this portfolio',
    ],
    technologies: ['React', 'JavaScript', 'GSAP', 'MongoDB'],
  },
  {
    id: 'continuous-learning',
    role: 'Continuous Learning',
    context: 'Ongoing',
    period: '20XX — Present',
    type: 'learning',
    current: true,
    description:
      'Deliberate practice on the parts I am weakest at — currently types, relational data and deployment — so the gap between what I can design and what I can build keeps closing.',
    highlights: [
      'Working through TypeScript, PostgreSQL, Prisma and Docker',
      'Reading source rather than only documentation',
      'Rebuilding solved problems to understand why the solution works',
    ],
    technologies: ['TypeScript', 'PostgreSQL', 'Prisma', 'Docker'],
  },
]

/**
 * @typedef {object} EducationEntry
 * @property {string} id
 * @property {string} qualification
 * @property {string} institution
 * @property {string} period
 * @property {string} [note]
 */

/**
 * Kept for a future education block. Empty rather than invented — a
 * qualification is a verifiable claim.
 * @type {EducationEntry[]}
 */
export const EDUCATION = []
