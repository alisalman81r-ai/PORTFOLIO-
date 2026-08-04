import { MEDIA } from './media.js'

/**
 * Personal information.
 *
 * The person behind the site: identity, positioning, contact, availability.
 * `site.js` describes the website; this describes you.
 *
 * ⚠️ PLACEHOLDERS ARE MARKED. Fields written in Title Case with a leading
 * "Your" are slots — they read acceptably in the layout so the design can be
 * judged, while remaining unmistakably unfilled. `role` and `avatar` are the
 * only ones already populated: the role is accurate to what this site is, and
 * the avatar resolves through `media.js`.
 *
 * Everything a visitor could act on — name, email, phone, location — is still
 * a slot, because a plausible-looking fake contact detail is worse than an
 * obvious gap. Fill them before launch.
 */

/**
 * @typedef {object} Personal
 * @property {string} name          Full name, as it should be read aloud.
 * @property {string} firstName     For informal copy ("Hi, I'm …").
 * @property {string} role          Professional title. Short — it sits under the hero headline.
 * @property {string} tagline       One line of positioning. The hero subhead.
 * @property {string} bioShort      1–2 sentences. About-section intro, meta description.
 * @property {string} bioLong       Full biography. Newline-separated paragraphs.
 * @property {string} location      City, Country.
 * @property {string} timezone      IANA identifier — for a live local-time display.
 * @property {string} email         Public contact address.
 * @property {string} phone         Optional. Empty string hides it.
 * @property {string} resumeUrl     Path to a CV in /public, or an external link.
 * @property {string} avatar        Portrait path. Import from @/assets/images.
 * @property {boolean} available    Drives the "available for work" indicator.
 * @property {string} availableFrom Human-readable availability note.
 * @property {number} yearsExperience Derived stats belong in components, but this
 *   one is a claim, not a calculation — keep it explicit and accurate.
 */

/** @type {Personal} */
export const PERSONAL = {
  name: 'Your Name',
  firstName: 'Your',
  role: 'Frontend Developer',
  tagline: 'I build fast, accessible web interfaces for people who care how things feel.',

  bioShort:
    'Frontend developer working across React and modern CSS, with a bias toward interfaces that stay fast and legible under real conditions.',
  bioLong: [
    'I work in the space between design and engineering — component architecture, motion, and the details that decide whether an interface feels considered or merely finished.',
    'Most of what I build is client and self-directed frontend work. I am currently extending into types, relational data and deployment, so I can own a feature from the interface down to the database.',
  ].join('\n\n'),

  location: 'Your City, Country',
  timezone: 'UTC',

  email: 'hello@yourdomain.com',
  phone: '',

  resumeUrl: '/resume.pdf',
  avatar: MEDIA.profile.avatar,

  available: true,
  availableFrom: 'Available for new projects',

  yearsExperience: 0,
}
