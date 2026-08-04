/**
 * About section content.
 *
 * The story, not the CV. The timeline in `timeline.js` covers *what happened*;
 * this covers how you think and how you work — which is what a client is
 * actually deciding on.
 *
 * PLACEHOLDER — the prose below is written as real, usable copy so the layout
 * can be judged with true line lengths, and it makes only claims about approach
 * rather than about achievements. Rewrite it in your own voice; nothing here
 * asserts a fact that could be wrong.
 */

export const ABOUT = {
  badge: 'About Me',

  /**
   * Headline lines. Same model as the hero: explicit line breaks are a content
   * decision, and `accent` marks the one line rendered in italic serif with a
   * gradient fill. One emphasised phrase per heading, never more.
   */
  headline: [
    { text: 'I care about how' },
    { text: 'things feel', accent: true },
    { text: 'to use' },
  ],

  /** Lead paragraph — sits directly under the heading, slightly larger. */
  intro:
    'I am a frontend developer who treats the interface as the product. Not a layer painted over the real work — the place where the work either makes sense to someone or does not.',

  /**
   * Story paragraphs. Two is the right length here: enough to establish a point
   * of view, short enough that it actually gets read.
   */
  story: [
    'Most of what I do sits between design and engineering. I like the problems that live there — why a layout stops working at an awkward width, why a transition feels heavy, why a form that validates correctly still feels hostile to fill in.',
    'I build in systems rather than screens: shared tokens, reusable components, motion that follows one set of rules. It makes the work faster to extend and, more importantly, it makes the result feel like one thing instead of many.',
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
    'Comfortable owning a feature from interface through to data',
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
      title: 'Backend Basics',
      description:
        'APIs, data modelling and deployment — enough depth to design a sensible contract with the backend instead of working around it.',
    },
    {
      id: 'design',
      icon: 'palette',
      title: 'UI/UX Focus',
      description:
        'Type, spacing, hierarchy and motion as one system. I care whether an interface reads clearly before I care whether it looks impressive.',
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
  techStack: [
    'React',
    'Next.js',
    'JavaScript',
    'Tailwind CSS',
    'GSAP',
    'Node.js',
  ],

  /** Floating chips over the portrait. Decorative — keep them short. */
  portraitChips: [
    { id: 'craft', icon: 'code', label: 'Clean code' },
    { id: 'motion', icon: 'sparkles', label: 'Thoughtful motion' },
  ],

  /** Heading for the journey block. */
  journey: {
    badge: 'The Path',
    title: 'Developer Journey',
    description:
      'How I got from a blank HTML file to shipping interfaces people rely on.',
  },
}
