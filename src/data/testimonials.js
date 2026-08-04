/**
 * Client and colleague testimonials.
 *
 * ⚠️ THIS FILE IS INTENTIONALLY EMPTY.
 *
 * Every other data file ships placeholder rows so layouts can be built against
 * a real shape. This one does not, and the reason is worth stating plainly:
 *
 * A testimonial is a quotation attributed to a named, identifiable person. A
 * realistic-looking placeholder ("Sarah Chen, Product Lead at Acme") is
 * indistinguishable from a real entry at a glance, and it is exactly the kind
 * of thing that survives to production unnoticed. At that point the site is
 * publishing a fabricated endorsement from a person who does not exist —
 * a misrepresentation to every visitor, and in commercial contexts a
 * potentially unlawful one.
 *
 * An empty array is safe: a testimonials section given nothing renders nothing.
 * A fake one is not. Add entries only once someone has actually said the words
 * and agreed to be quoted.
 *
 * The typedef below is the full contract, so the section can still be built
 * before any real quote exists — use the `HAS_TESTIMONIALS` guard to skip
 * rendering rather than special-casing an empty grid.
 */

/**
 * @typedef {object} Testimonial
 * @property {string} id
 * @property {string} quote    The testimonial itself. Keep verbatim — tighten
 *   only with the author's approval.
 * @property {string} author   Full name of a real person.
 * @property {string} role     Their title.
 * @property {string} company
 * @property {string} [companyUrl]
 * @property {string|null} [avatar] Portrait, imported from @/assets/images.
 * @property {string} [projectSlug] Links to the related project in `projects.js`.
 * @property {string} [sourceUrl] Where it was said — LinkedIn recommendation,
 *   public review. Verifiability is what makes a testimonial persuasive.
 */

/**
 * @type {Testimonial[]}
 *
 * @example
 * // The shape to follow, once you have a real quote and permission to use it:
 * {
 *   id: 'jane-doe',
 *   quote: 'The exact words they wrote or said.',
 *   author: 'Jane Doe',
 *   role: 'Head of Product',
 *   company: 'Company Name',
 *   companyUrl: 'https://…',
 *   avatar: null,
 *   projectSlug: 'project-one',
 *   sourceUrl: 'https://linkedin.com/…',
 * }
 */
export const TESTIMONIALS = []

/**
 * Whether there is anything to show.
 *
 * A testimonials section with one quote looks worse than no section at all —
 * it reads as "this is the only nice thing anyone has said". Gate on the count,
 * not just on emptiness.
 *
 * @type {boolean}
 */
export const HAS_TESTIMONIALS = TESTIMONIALS.length >= 2
