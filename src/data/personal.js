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
 * Note: there is no `yearsExperience` field. It is derived from
 * `JOURNEY_START_YEAR` in `timeline.js` — see `achievements.js` — so the figure
 * advances on its own and can never contradict the timeline beside it.
 */

/** @type {Personal} */
export const PERSONAL = {
  name: 'Your Name',
  firstName: 'Your',
  role: 'Graphic Designer & Frontend Developer',
  tagline: 'I design it, then I build it — interfaces that look considered and hold up under real use.',

  bioShort:
    'Designer turned developer. I started in Photoshop and Illustrator, moved into interface design, and now build the things I design in React — which means the handoff between the two is a conversation with myself.',
  bioLong: [
    'I came to code through design, which shapes how I work: I notice the half-pixel misalignment and the transition that feels a frame too slow, because I spent two years learning to see those things before I could build them.',
    'These days most of my work is frontend — React, Next.js and Tailwind — with enough Node, Express and database work behind it to take a feature from interface to data. Still designing, still building, increasingly both on the same project.',
  ].join('\n\n'),

  location: 'Your City, Country',
  timezone: 'UTC',

  email: 'hello@yourdomain.com',
  phone: '',

  resumeUrl: '/resume.pdf',
  avatar: MEDIA.profile.avatar,

  available: true,
  availableFrom: 'Available for new projects',

}
