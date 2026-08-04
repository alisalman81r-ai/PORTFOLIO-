/**
 * Technical skills, grouped by discipline.
 *
 * Grouped rather than flat because a wall of forty logos communicates nothing.
 * Categories let a section render as columns, tabs, or a filtered marquee
 * without restructuring the data.
 *
 * NO PROFICIENCY PERCENTAGES. "React 92%" is unverifiable, invites scepticism,
 * and is the most-mocked convention in portfolio design. `level` is a coarse
 * honest band instead — and it's optional.
 */

/**
 * @typedef {object} Skill
 * @property {string} name  Display name, spelled as the vendor spells it.
 * @property {'core'|'working'|'familiar'} [level]
 *   core     — reach for daily, could teach it
 *   working  — productive without documentation
 *   familiar — have shipped with it, would need a refresher
 * @property {string} [icon] Lookup key for an icon component. See `socials.js`.
 */

/**
 * @typedef {object} SkillCategory
 * @property {string} id     Stable key.
 * @property {string} title  Section heading.
 * @property {Skill[]} items
 */

/**
 * Starter set — generic and safe to keep, but PRUNE IT.
 *
 * A skills list is a claim about you. Listing everything you have heard of
 * reads as noise; five things you are genuinely strong in reads as confidence.
 * Delete anything you would not want to be interviewed on.
 *
 * @type {SkillCategory[]}
 */
export const SKILL_CATEGORIES = [
  {
    id: 'frontend',
    title: 'Frontend',
    items: [
      { name: 'React', level: 'core' },
      { name: 'JavaScript', level: 'core' },
      { name: 'TypeScript', level: 'working' },
      { name: 'HTML', level: 'core' },
      { name: 'CSS', level: 'core' },
      { name: 'Tailwind CSS', level: 'core' },
    ],
  },
  {
    id: 'motion',
    title: 'Motion & Interaction',
    items: [
      { name: 'GSAP', level: 'working' },
      { name: 'Motion', level: 'working' },
      { name: 'Lenis', level: 'working' },
      { name: 'CSS Animations', level: 'core' },
    ],
  },
  {
    id: 'tooling',
    title: 'Tooling',
    items: [
      { name: 'Vite', level: 'core' },
      { name: 'Git', level: 'core' },
      { name: 'Figma', level: 'working' },
      { name: 'Vercel', level: 'working' },
    ],
  },
]

/**
 * Flattened list — for marquees, tag clouds, and anywhere grouping is noise.
 *
 * Derived rather than duplicated, so adding a skill to a category above is the
 * only edit ever needed. Two hand-maintained lists always drift apart.
 *
 * @type {Skill[]}
 */
export const ALL_SKILLS = SKILL_CATEGORIES.flatMap((category) => category.items)
