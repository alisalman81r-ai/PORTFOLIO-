/**
 * Creative journey — the milestone timeline.
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
 * THE ARC THIS DESCRIBES
 * Design → interface → frontend → backend → shipping. That progression is the
 * story worth telling, because it explains *why* the work looks the way it
 * does: someone who started in Photoshop notices different things than someone
 * who started in a terminal. `skills.js` groups the same arc by discipline, and
 * `experience.js` gives it dated context.
 *
 * The final entry is marked `current`, which highlights its node and stops the
 * progress rail there. Move the flag when the next chapter starts.
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
    id: 'graphic-design',
    year: '2022',
    title: 'Started Learning Graphic Design',
    description:
      'Began with Photoshop, Illustrator and Canva, and with the fundamentals underneath them — composition, hierarchy, type and colour. Learning to see why a layout works before learning to build one.',
    icon: 'brush',
  },
  {
    id: 'ui-ux',
    year: '2023',
    title: 'UI/UX & Figma',
    description:
      'Moved from static compositions to interfaces: layouts, components, type scales, colour systems and responsive behaviour. Design stopped being one picture and became a system.',
    icon: 'handoff',
  },
  {
    id: 'frontend',
    year: '2024',
    title: 'Frontend Development',
    description:
      'Started building what I had been designing — HTML, CSS and JavaScript first, then Tailwind CSS, React and Next.js. The gap between a design file and a working page closed.',
    icon: 'frontend',
  },
  {
    id: 'full-stack',
    year: '2025',
    title: 'Backend & Full Stack Development',
    description:
      'Node.js, Express, databases and APIs, plus the workflow around them: Git, GitHub and deployment. Enough of the back end to reason about a feature from the interface down to the data.',
    icon: 'server',
  },
  {
    id: 'shipping',
    year: '2026',
    title: 'Building Real Projects',
    description:
      'Production work: client sites, this portfolio, and the habit of finishing things properly — accessible, fast, and maintainable by whoever picks them up next.',
    icon: 'briefcase',
    current: true,
  },
]

/**
 * The year the journey began.
 *
 * Exported so anything that needs "how long has this been going" derives it
 * rather than restating it — see `achievements.js`. One place to edit means the
 * figure can never contradict the timeline above it.
 *
 * @type {number}
 */
export const JOURNEY_START_YEAR = Number(JOURNEY[0].year)
