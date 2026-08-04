/**
 * Personal information.
 *
 * The person behind the site: identity, positioning, contact, availability.
 * `site.js` describes the website; this describes you.
 *
 * PLACEHOLDER CONTENT — every string below is a slot to fill. It is written to
 * look obviously unfinished rather than plausible, so nothing here can quietly
 * survive into production.
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
  name: 'YOUR NAME',
  firstName: 'YOUR FIRST NAME',
  role: 'YOUR ROLE',
  tagline: 'ONE LINE THAT SAYS WHAT YOU DO AND WHO FOR.',

  bioShort: 'SHORT BIO — one or two sentences.',
  bioLong: [
    'FIRST PARAGRAPH — how you work and what you care about.',
    'SECOND PARAGRAPH — background, and what you are looking for next.',
  ].join('\n\n'),

  location: 'CITY, COUNTRY',
  timezone: 'UTC',

  email: 'you@example.com',
  phone: '',

  resumeUrl: '/resume.pdf',
  avatar: '',

  available: true,
  availableFrom: 'Available for new projects',

  yearsExperience: 0,
}
