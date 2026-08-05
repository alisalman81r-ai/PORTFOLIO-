/**
 * About section content.
 *
 * The story, not the CV. The timeline in `timeline.js` covers *what happened*;
 * this covers how you think and how you work — which is what a client is
 * actually deciding on.
 *
 * The narrative arc here is yours — design from 2022, code from 2024 — so it
 * does now assert history rather than only approach. The wording is mine and
 * should be rewritten in your voice; the facts underneath it came from you and
 * match `timeline.js`. If you change one, change both.
 */

export const ABOUT = {
  badge: 'About Me',

  /**
   * Headline lines. Same model as the hero: explicit line breaks are a content
   * decision, and `accent` marks the one line rendered in italic serif with a
   * gradient fill. One emphasised phrase per heading, never more.
   */
  headline: [
    { text: 'I design it,' },
    { text: 'then I build it', accent: true },
  ],

  /** Lead paragraph — sits directly under the heading, slightly larger. */
  intro:
    'I started in graphic design and ended up writing the code as well. Both halves inform each other: the design is buildable because I know what it costs, and the build is faithful because I drew it.',

  /**
   * Story paragraphs. Two is the right length here: enough to establish a point
   * of view, short enough that it actually gets read.
   */
  story: [
    'Four years ago that meant Photoshop and Illustrator — composition, type, colour, and learning why some layouts work and others merely fill space. Interface design came next, then the code to build it.',
    'What carried across was the systems thinking. I build in tokens and components rather than screens, so the second page costs less than the first — and the whole thing reads as one considered object instead of a stack of separate decisions.',
  ],

  /**
   * Short proof points beside the story. Deliberately about *practice* rather
   * than numbers — an unverifiable "50+ projects" reads as filler, while a
   * concrete statement about how you work does not.
   */
  highlights: [
    'Accessible by default — semantic markup, keyboard paths, reduced-motion support',
    'Performance treated as a feature, with a budget rather than a hope',
    'Design systems over one-off screens, so the second page costs less than the first',
    'Design and build in one pair of hands — no handoff, no translation loss',
  ],

  /**
   * The four pillar cards.
   *
   * `icon` is a registry key resolved by `<Icon />` — never an imported
   * component, so this file stays serialisable and CMS-ready.
   */
  pillars: [
    {
      id: 'frontend',
      icon: 'monitor',
      title: 'Frontend Development',
      description:
        'React and modern CSS, built component-first. Responsive, accessible, and fast on the mid-range hardware most people actually browse on.',
    },
    {
      id: 'backend',
      icon: 'server',
      title: 'Backend & Full Stack',
      description:
        'Node, Express, databases and deployment — enough depth to design a sensible contract with the server instead of working around whatever it returns.',
    },
    {
      id: 'design',
      icon: 'brush',
      title: 'Design & Visual Craft',
      description:
        'Graphic design through to interface: composition, type, colour and motion as one system. Whether it reads clearly matters before whether it looks impressive.',
    },
    {
      id: 'problem-solving',
      icon: 'puzzle',
      title: 'Creative Problem Solving',
      description:
        'Ambiguous problems reduced to something buildable. Usually by finding the constraint everyone assumed was fixed and checking whether it is.',
    },
  ],

  /**
   * Tech stack preview.
   *
   * A curated shortlist, deliberately not derived from `skills.js`. That file is
   * the full matrix for a dedicated Skills section; this is the six things worth
   * saying in a paragraph of context. Different jobs, so different data.
   */
  techStack: ['Figma', 'Photoshop', 'React', 'Next.js', 'Tailwind CSS', 'Node.js'],

  /** Floating chips over the portrait. Decorative — keep them short. */
  portraitChips: [
    { id: 'design', icon: 'brush', label: 'Design first' },
    { id: 'code', icon: 'code', label: 'Then code' },
  ],

  /** Heading for the journey block. */
  journey: {
    badge: 'The Path',
    title: 'Creative Journey',
    description:
      'From Photoshop in 2022 to shipping full-stack projects — the short version.',
  },
}
