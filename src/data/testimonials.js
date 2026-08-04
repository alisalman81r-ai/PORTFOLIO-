import { MEDIA } from './media.js'

/**
 * Client testimonials.
 *
 * ⚠️ READ THIS BEFORE PUBLISHING
 *
 * A testimonial is a quotation attributed to a named, identifiable person. The
 * entries below are placeholders, and the names are written as obvious slots —
 * `Client Name`, `Role`, `Company` — rather than as realistic people.
 *
 * That is deliberate. A plausible-looking placeholder ("Sarah Chen, Product
 * Lead at Northwind") is indistinguishable from a real entry at a glance, and
 * it is exactly the kind of thing that survives to production unnoticed. At
 * that point the site is publishing a fabricated endorsement from a person who
 * does not exist — a misrepresentation to every visitor, and in commercial
 * contexts a potentially unlawful one.
 *
 * The quotes are written as realistic copy so the carousel can be judged with
 * true line lengths. They are safe only because the attribution is obviously
 * unfilled. Replace the names and the quotes together, or delete the entry.
 *
 * Add entries only once someone has actually said the words and agreed to be
 * quoted. `sourceUrl` is worth filling in — a testimonial a visitor can verify
 * is worth several they cannot.
 */

export const TESTIMONIALS_META = {
  badge: 'Testimonials',
  headline: [{ text: 'What clients' }, { text: 'say after', accent: true }],
  intro:
    'The part of the work that outlasts the project: whether the people who paid for it would do it again.',
}

/**
 * @typedef {object} Testimonial
 * @property {string} id
 * @property {string} quote      Verbatim. Tighten only with the author's approval.
 * @property {string} author     Full name of a real person.
 * @property {string} role       Their title.
 * @property {string} company
 * @property {string|null} avatar Portrait, imported from `@/assets/images`.
 *   Null renders initials, which looks deliberate rather than broken.
 * @property {number} rating     1–5. Only include what was actually given.
 * @property {string} projectType What the engagement was, e.g. 'Web Application'.
 * @property {string} [projectSlug] Links to the matching entry in `projects.js`.
 * @property {string} [sourceUrl] Where it was said — a LinkedIn recommendation,
 *   a public review. Verifiability is what makes a testimonial persuasive.
 */

/** @type {Testimonial[]} */
export const TESTIMONIALS = [
  {
    id: 'placeholder-1',
    quote:
      'The thing that stood out was how much thought went in before any code was written. We got asked the awkward questions early, which meant nothing had to be unpicked later.',
    author: 'Client Name',
    role: 'Role',
    company: 'Company',
    avatar: MEDIA.testimonials['placeholder-1'],
    rating: 5,
    projectType: 'Web Application',
    sourceUrl: '',
  },
  {
    id: 'placeholder-2',
    quote:
      'Delivered on time and, more usefully, handed over something our own team could pick up and extend. Six months on we are still adding to it without needing to call anyone.',
    author: 'Client Name',
    role: 'Role',
    company: 'Company',
    avatar: MEDIA.testimonials['placeholder-2'],
    rating: 5,
    projectType: 'Marketing Site',
    sourceUrl: '',
  },
  {
    id: 'placeholder-3',
    quote:
      'Communicated in plain language throughout. I always knew what stage we were at and what was coming next, which is rarer than it should be.',
    author: 'Client Name',
    role: 'Role',
    company: 'Company',
    avatar: MEDIA.testimonials['placeholder-3'],
    rating: 5,
    projectType: 'Design & Build',
    sourceUrl: '',
  },
  {
    id: 'placeholder-4',
    quote:
      'Took a rough brief and came back with something sharper than what we had asked for, along with the reasoning. The site is noticeably faster than the one it replaced.',
    author: 'Client Name',
    role: 'Role',
    company: 'Company',
    avatar: MEDIA.testimonials['placeholder-4'],
    rating: 5,
    projectType: 'Performance Audit',
    sourceUrl: '',
  },
]

/**
 * Whether there is enough to show.
 *
 * A testimonials section with one quote reads as "this is the only nice thing
 * anyone has said". Gate on the count, not merely on emptiness — the section
 * renders nothing at all below the threshold.
 *
 * @type {boolean}
 */
export const HAS_TESTIMONIALS = TESTIMONIALS.length >= 2
