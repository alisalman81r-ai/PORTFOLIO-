/**
 * Services offered.
 *
 * What a client can hire you for. Distinct from `skills.js`: skills are tools
 * you know, services are outcomes someone buys. A client is not purchasing
 * "React" — they are purchasing a site that loads fast and converts.
 *
 * Descriptions are written from the client's side of the table. "Component
 * architecture" is a means; "a site your team can extend without me" is the
 * thing being bought.
 */

export const SERVICES_META = {
  badge: 'Services',
  headline: [{ text: 'What I can' }, { text: 'build for you', accent: true }],
  intro:
    'Six things I do well, and will say honestly when a project needs something else. Every engagement ends with work you can maintain — not a codebase that only makes sense to the person who wrote it.',
}

/**
 * @typedef {object} Service
 * @property {string} id
 * @property {string} icon         Registry key resolved by `<Icon />`.
 * @property {string} title
 * @property {string} description  Two or three sentences on what is included.
 * @property {string[]} deliverables Concrete artefacts the client receives.
 * @property {string} cta          Button label. Phrased as the client's next
 *   step, not as a command.
 */

/** @type {Service[]} */
export const SERVICES = [
  {
    id: 'frontend',
    icon: 'frontend',
    title: 'Frontend Development',
    description:
      'Interfaces built component-first in React, with state that stays predictable as features are added. Accessible markup and keyboard paths are part of the build, not a later pass.',
    deliverables: ['Component library', 'Accessible markup', 'Documented patterns'],
    cta: 'Discuss a build',
  },
  {
    id: 'full-stack',
    icon: 'fullstack',
    title: 'Full Stack Web Development',
    description:
      'End-to-end delivery: interface, API contract, data model and deployment. Owning both sides means the shape of the data suits the interface instead of the interface working around it.',
    deliverables: ['API integration', 'Data modelling', 'Deployment pipeline'],
    cta: 'Scope a project',
  },
  {
    id: 'responsive',
    icon: 'responsive',
    title: 'Responsive Website Development',
    description:
      // Plain text — these strings render as-is, so no markdown emphasis.
      'Layouts that hold up between breakpoints, not only at them. Fluid type and spacing, tested on real viewport sizes rather than the three in the design file.',
    deliverables: ['Fluid layout system', 'Cross-device testing', 'Mobile-first build'],
    cta: 'Get a quote',
  },
  {
    id: 'figma-to-code',
    icon: 'handoff',
    title: 'UI Implementation from Figma',
    description:
      'Pixel-accurate translation of a design file into working code — including the states the file does not show: empty, loading, error, and everything between the two artboards.',
    deliverables: ['Faithful implementation', 'All interaction states', 'Design QA pass'],
    cta: 'Send me a file',
  },
  {
    id: 'performance',
    icon: 'gauge',
    title: 'Website Performance Optimization',
    description:
      'Audit and remediation against Core Web Vitals — bundle size, image delivery, render-blocking resources, layout shift. Findings documented so the gains survive the next release.',
    deliverables: ['Performance audit', 'Prioritised fixes', 'Before/after report'],
    cta: 'Request an audit',
  },
  {
    id: 'maintenance',
    icon: 'maintain',
    title: 'Website Maintenance',
    description:
      'Ongoing care once a site is live: dependency updates, security patches, content changes and small features. The unglamorous work that decides whether a site still works in two years.',
    deliverables: ['Dependency updates', 'Bug fixes', 'Content changes'],
    cta: 'Talk about support',
  },
]
