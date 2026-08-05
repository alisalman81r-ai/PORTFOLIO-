/**
 * Technical skills, grouped by discipline.
 *
 * Drives the Skills section end to end: the category rail, the counts, the
 * panel, and every card. Adding a technology is one object in the right
 * `items` array — nothing in the components knows what a skill is called.
 *
 * NO PROFICIENCY PERCENTAGES. "React 92%" is unverifiable, invites scepticism,
 * and is the single most-mocked convention in portfolio design. `level` is a
 * coarse, honest band instead.
 *
 * Ordered roughly as the skills were acquired: design first, then interface,
 * then code. See `timeline.js` for the same arc as a dated journey.
 *
 * ⚠️ REVIEW THE LEVELS. They are an opening estimate inferred from the stack
 * and journey you described, not a measurement. `learning` is yours — you named
 * those four. Adjust the rest; each one is a claim you may be asked about.
 */

/**
 * Experience bands.
 *
 * Declared here rather than in the component so the vocabulary and its wording
 * live beside the data that uses it. `tone` maps to a `<Tag>` variant.
 *
 * @typedef {'core'|'working'|'familiar'|'learning'} SkillLevel
 */
export const SKILL_LEVELS = {
  core: { label: 'Core', tone: 'accent', hint: 'Reach for it daily' },
  working: { label: 'Working', tone: 'default', hint: 'Productive without the docs open' },
  familiar: { label: 'Familiar', tone: 'outline', hint: 'Have shipped with it before' },
  learning: { label: 'Learning', tone: 'outline', hint: 'Actively studying' },
}

/**
 * @typedef {object} Skill
 * @property {string} id
 * @property {string} name         As the vendor spells it.
 * @property {string} icon         Key resolved by `<TechIcon />`. Brand marks
 *   come from Simple Icons; anything unmatched falls back to the lucide
 *   registry, which is how non-branded disciplines get an icon.
 * @property {string} description  One line on what it is *for*. Not a definition
 *   — the reader knows what React is; say what you use it to do.
 * @property {SkillLevel} level
 */

/**
 * @typedef {object} SkillCategory
 * @property {string} id
 * @property {string} label    Rail label.
 * @property {string} icon     Lucide registry key.
 * @property {string} summary  Sentence shown above the cards when selected.
 * @property {Skill[]} items
 */

/** @type {SkillCategory[]} */
export const SKILL_CATEGORIES = [
  {
    id: 'frontend',
    label: 'Frontend',
    icon: 'monitor',
    summary:
      'The layer people actually touch. Semantic markup, modern CSS, and component architecture that stays readable as a project grows.',
    items: [
      {
        id: 'html',
        name: 'HTML',
        icon: 'html',
        description: 'Semantic structure — the accessibility baseline everything else builds on.',
        level: 'core',
      },
      {
        id: 'css',
        name: 'CSS',
        icon: 'css',
        description: 'Modern layout: grid, container queries, cascade layers, custom properties.',
        level: 'core',
      },
      {
        id: 'javascript',
        name: 'JavaScript',
        icon: 'javascript',
        description: 'The language underneath the frameworks. ES modules, async, the DOM.',
        level: 'core',
      },
      {
        id: 'react',
        name: 'React',
        icon: 'react',
        description: 'Component-driven interfaces, hooks, and state that stays predictable.',
        level: 'core',
      },
      {
        id: 'nextjs',
        name: 'Next.js',
        icon: 'nextjs',
        description: 'Routing, server rendering, and shipping fast pages by default.',
        level: 'working',
      },
      {
        id: 'tailwind',
        name: 'Tailwind CSS',
        icon: 'tailwind',
        description: 'Design tokens as utilities — consistency enforced by the system, not by review.',
        level: 'core',
      },
    ],
  },
  {
    id: 'backend',
    label: 'Backend',
    icon: 'server',
    summary:
      'Enough depth to design a sensible contract with the server instead of working around whatever it returns.',
    items: [
      {
        id: 'node',
        name: 'Node.js',
        icon: 'node',
        description: 'Server-side JavaScript — APIs, tooling, and build scripts.',
        level: 'working',
      },
      {
        id: 'express',
        name: 'Express.js',
        icon: 'express',
        description: 'Routing, middleware, and REST endpoints without ceremony.',
        level: 'working',
      },
    ],
  },
  {
    id: 'database',
    label: 'Database',
    icon: 'database',
    summary:
      'Modelling data so the interface can ask simple questions of it — most frontend complexity starts as a shape problem.',
    items: [
      {
        id: 'mongodb',
        name: 'MongoDB',
        icon: 'mongodb',
        description: 'Document storage, schema design, and aggregation basics.',
        level: 'working',
      },
      {
        id: 'firebase',
        name: 'Firebase',
        icon: 'firebase',
        description: 'Auth, realtime data, and hosting when speed to launch matters most.',
        level: 'working',
      },
    ],
  },
  {
    id: 'design',
    label: 'UI/UX',
    icon: 'palette',
    summary:
      'Not decoration. The decisions that determine whether an interface reads clearly before anyone judges how it looks.',
    items: [
      {
        id: 'design-systems',
        name: 'Design Systems',
        icon: 'layers',
        description: 'Tokens, scales, and components — so the second page costs less than the first.',
        level: 'working',
      },
      {
        id: 'accessibility',
        name: 'Accessibility',
        icon: 'accessibility',
        description: 'Keyboard paths, contrast, focus order, and reduced-motion support.',
        level: 'working',
      },
      {
        id: 'motion',
        name: 'Motion Design',
        icon: 'sparkles',
        description: 'Easing, timing, and choreography that guide attention rather than demand it.',
        level: 'working',
      },
      {
        id: 'responsive',
        name: 'Responsive Layout',
        icon: 'monitor',
        description: 'Fluid type and layout that hold up between breakpoints, not just at them.',
        level: 'core',
      },
    ],
  },
  {
    id: 'graphic-design',
    label: 'Graphic Design',
    icon: 'brush',
    summary:
      'Where I started, and still the reason I notice when spacing is off. Composition, type and colour worked out in a design tool before anything reaches a browser.',
    items: [
      {
        id: 'photoshop',
        name: 'Adobe Photoshop',
        icon: 'photoshop',
        description: 'Raster work — retouching, compositing, and preparing assets for the web.',
        level: 'core',
      },
      {
        id: 'illustrator',
        name: 'Adobe Illustrator',
        icon: 'illustrator',
        description: 'Vector work — logos, icons and marks that stay sharp at any size.',
        level: 'working',
      },
      {
        id: 'figma',
        name: 'Figma',
        icon: 'figma',
        description: 'Interface design, components and specs — the bridge from design into code.',
        level: 'core',
      },
      {
        id: 'canva',
        name: 'Canva',
        icon: 'canva',
        description: 'Fast turnarounds for social and print when a full design file is overkill.',
        level: 'working',
      },
    ],
  },
  {
    id: 'tools',
    label: 'Tools',
    icon: 'wrench',
    summary:
      'The workflow around the code — version control, design handoff, and getting work in front of people quickly.',
    items: [
      {
        id: 'git',
        name: 'Git',
        icon: 'git',
        description: 'Branching, rebasing, and a history that reads as an explanation.',
        level: 'core',
      },
      {
        id: 'github',
        name: 'GitHub',
        icon: 'github',
        description: 'Pull requests, reviews, and Actions for CI.',
        level: 'core',
      },
      {
        id: 'vscode',
        name: 'VS Code',
        icon: 'code',
        description: 'Daily driver — configured for fast navigation and refactors.',
        level: 'core',
      },
      {
        id: 'vercel',
        name: 'Vercel',
        icon: 'vercel',
        description: 'Preview deployments and production hosting for frontend work.',
        level: 'working',
      },
    ],
  },
  {
    id: 'learning',
    label: 'Currently Learning',
    icon: 'graduation',
    summary:
      'What I am actively working through. Listed honestly — knowing where the edge of your knowledge is matters more than pretending it is elsewhere.',
    items: [
      {
        id: 'typescript',
        name: 'TypeScript',
        icon: 'typescript',
        description: 'Types as design: catching contract mistakes before they become bugs.',
        level: 'learning',
      },
      {
        id: 'postgresql',
        name: 'PostgreSQL',
        icon: 'postgresql',
        description: 'Relational modelling, joins, and thinking in sets rather than loops.',
        level: 'learning',
      },
      {
        id: 'prisma',
        name: 'Prisma',
        icon: 'prisma',
        description: 'Typed database access and migrations that stay reviewable.',
        level: 'learning',
      },
      {
        id: 'docker',
        name: 'Docker',
        icon: 'docker',
        description: 'Reproducible environments — "works on my machine" as a solved problem.',
        level: 'learning',
      },
    ],
  },
]

/**
 * Flat list — for marquees, tag clouds, and counts.
 *
 * Derived rather than duplicated, so adding a skill above is the only edit ever
 * needed. Two hand-maintained lists always drift apart.
 *
 * @type {Skill[]}
 */
export const ALL_SKILLS = SKILL_CATEGORIES.flatMap((category) => category.items)

/** Total count, for the section intro. @type {number} */
export const SKILL_COUNT = ALL_SKILLS.length
