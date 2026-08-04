/**
 * Developer journey — the milestone timeline.
 *
 * ADDING A MILESTONE
 * ------------------
 * Append an object to `JOURNEY`. Nothing else needs to change: the rail, the
 * scroll-linked progress line, the numbering, and the stagger are all derived
 * from array length and index. That is the whole point of keeping this here
 * rather than as JSX — a new milestone is one object, not a new component.
 *
 * Order is chronological, oldest first. The component reads it top to bottom.
 *
 * ⚠️ YEARS ARE PLACEHOLDERS. Every entry reads `20XX` because the real dates
 * are yours and inventing them would put fabricated claims on a page recruiters
 * read. Replace each one. `Current` on the last entry is real and can stay.
 */

/**
 * @typedef {object} Milestone
 * @property {string} id          Stable key.
 * @property {string} year        Display label — a year, or 'Current'.
 * @property {string} title       The milestone itself. Keep it short.
 * @property {string} description One or two sentences. What changed, or what
 *   you learned — not a job description.
 * @property {string} icon        Registry key resolved by `<Icon />`.
 * @property {boolean} [current]  Marks the active entry: highlights the node,
 *   pulses it, and stops the progress rail there.
 */

/** @type {Milestone[]} */
export const JOURNEY = [
  {
    id: 'started-learning',
    year: '20XX',
    title: 'Started Learning Web Development',
    description:
      'Began with HTML, CSS and JavaScript fundamentals — building small static pages until layout and the box model stopped being guesswork.',
    icon: 'sprout',
  },
  {
    id: 'first-react-project',
    year: '20XX',
    title: 'Built First React Project',
    description:
      'Moved from pages to components. Learned state, props and the render cycle by building something end to end rather than following along.',
    icon: 'atom',
  },
  {
    id: 'learned-nextjs',
    year: '20XX',
    title: 'Learned Next.js',
    description:
      'Added routing, server rendering and file-based structure — and started thinking about performance and SEO as part of the build, not an afterthought.',
    icon: 'layers',
  },
  {
    id: 'ev-charger-finder',
    year: '20XX',
    title: 'Worked on EV Charger Finder',
    description:
      'Built a location-driven interface with live data and map interaction. First real lesson in handling async state and empty, loading and error cases properly.',
    icon: 'zap',
  },
  {
    id: 'construction-website',
    year: '20XX',
    title: 'Built Construction Website',
    description:
      'Delivered a client-facing marketing site with a content structure the client could maintain, and a layout that held up from mobile to desktop.',
    icon: 'building',
  },
  {
    id: 'storyboard-design',
    year: '20XX',
    title: 'Created Storyboard Design for Client',
    description:
      'Worked ahead of implementation — mapping the narrative and visual flow before a line of code, so the build started from a decision rather than a blank page.',
    icon: 'storyboard',
  },
  {
    id: 'full-stack',
    year: 'Current',
    title: 'Continuously Learning Full Stack Development',
    description:
      'Extending into APIs, databases and deployment so I can reason about a feature from the interface all the way down to the data.',
    icon: 'infinity',
    current: true,
  },
]
