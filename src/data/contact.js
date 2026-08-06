import { CONTACT_SCHEMA, HONEYPOT_FIELD } from '@shared/contactSchema.js'

import { PERSONAL } from './personal.js'

/**
 * Contact section content and form schema.
 *
 * The form's *shape* lives here as declarative constraints — label, type,
 * required, length bounds. The validation *logic* that interprets them lives in
 * `hooks/useForm.js`.
 *
 * That split matters: a field is content (it can be renamed, reordered, or
 * removed by whoever owns the copy), while "an email must contain an @ before a
 * dot" is behaviour. Encoding rules as strings here — `validate: 'email|min:20'`
 * — would put a parser in the data layer and a second language in the project.
 */

export const CONTACT_META = {
  badge: 'Contact',
  headline: [{ text: 'Let us build' }, { text: 'something good', accent: true }],
  intro:
    'Tell me what you are working on and what success looks like. I read every message and reply within two working days — including the ones that turn out not to be a fit, with a pointer to someone who is.',
}

/**
 * Direct contact methods.
 *
 * `value` is what a visitor reads; `href` is what the browser does. They differ
 * on purpose — nobody wants to read `mailto:` — and an entry with an empty
 * `href` renders as plain text rather than a dead link.
 *
 * @typedef {object} ContactMethod
 * @property {string} id
 * @property {string} icon    Registry key resolved by `<Icon />`.
 * @property {string} label   What this is.
 * @property {string} value   Display text.
 * @property {string} href    Empty renders it non-interactive.
 * @property {boolean} [external]
 */

/** @type {ContactMethod[]} */
export const CONTACT_METHODS = [
  {
    id: 'email',
    icon: 'mail',
    label: 'Email',
    value: PERSONAL.email,
    href: PERSONAL.email ? `mailto:${PERSONAL.email}` : '',
  },
  {
    id: 'phone',
    icon: 'phone',
    label: 'Phone',
    // PLACEHOLDER — `PERSONAL.phone` is an empty string, so this shows as a slot
    // rather than a fabricated number. Fill it in `personal.js` or delete this entry.
    value: PERSONAL.phone || 'Add your number',
    href: PERSONAL.phone ? `tel:${PERSONAL.phone.replace(/\s/g, '')}` : '',
  },
  {
    id: 'location',
    icon: 'location',
    label: 'Location',
    value: PERSONAL.location,
    href: '',
  },
]

/**
 * Form field schema.
 *
 * `autoComplete` is not decoration — it is what lets a browser or password
 * manager fill a form in one action, and it is a WCAG 1.3.5 requirement for
 * fields that collect information about the user.
 *
 * @typedef {object} FormFieldConfig
 * @property {string} id            Also the input `name`.
 * @property {string} label
 * @property {'text'|'email'|'textarea'|'select'} type
 * @property {string} placeholder
 * @property {string} [autoComplete]
 * @property {boolean} required
 * @property {number} [minLength]
 * @property {number} [maxLength]
 * @property {number} [rows]        Textareas only.
 * @property {boolean} [fullWidth]  Spans both columns of the two-column grid.
 *   Textareas do this implicitly; a short field only needs it when a half-width
 *   cell would leave an obvious gap beside it.
 * @property {string} [hint]        Shown under the label, before any error.
 */

/**
 * Presentation, keyed by field id.
 *
 * THE CONSTRAINTS ARE NOT HERE, AND MUST NOT BE.
 * Labels, types, required flags and length limits live in
 * `shared/contactSchema.js`, which the serverless function in `/api` imports as
 * well. That file is the contract; this one is how the contract is dressed.
 *
 * The split matters because the browser and the server both validate this form
 * and have to agree. Two copies of "message must be at least 20 characters" is
 * how a form ends up accepting input on one side and rejecting it on the other.
 * Everything below is safe to change freely — none of it is a rule.
 */
const FIELD_PRESENTATION = {
  name: { placeholder: 'Your name', autoComplete: 'name' },
  email: { placeholder: 'you@company.com', autoComplete: 'email' },
  company: { placeholder: 'Optional', autoComplete: 'organization' },
  // NO HINTS ON HALF-WIDTH FIELDS.
  //
  // A hint adds a line to its cell, and in a two-column grid that pushes its
  // own control down while the one beside it stays put. Both fixes are worse
  // than the problem: leave it, and the inputs are visibly misaligned; bottom-
  // align the row, and the field *without* a hint gets a gap under its label.
  //
  // So guidance on these two lives in their option lists instead — "Prefer not
  // to say" says everything "this is optional" would. The message field keeps
  // its hint because it spans the grid and has nothing to misalign with.
  service: { autoComplete: 'off' },
  budget: { autoComplete: 'off' },
  timeline: { autoComplete: 'off' },
  subject: { placeholder: 'What is this about?', autoComplete: 'off', fullWidth: true },
  message: {
    placeholder: 'What are you building, and what does done look like?',
    rows: 6,
    hint: 'The more context, the more useful my reply.',
  },
}

/**
 * The rendered form: shared constraints merged with local presentation.
 *
 * Adding a field is one entry in `shared/contactSchema.js` and one here. It
 * then validates on both sides, renders, stores and appears in both emails with
 * no other change.
 *
 * @type {FormFieldConfig[]}
 */
export const FORM_FIELDS = CONTACT_SCHEMA.map((field) => ({
  ...field,
  ...FIELD_PRESENTATION[field.id],
}))

/**
 * Name of the honeypot field.
 *
 * A hidden input no human can see or tab into. Bots fill every field they find,
 * so a value here means the submission is automated — it is accepted silently
 * rather than rejected, since telling a bot it failed only teaches it to try
 * again. Costs nothing and catches the majority of drive-by spam without a
 * CAPTCHA, which is a real accessibility burden.
 */
export { HONEYPOT_FIELD }

/**
 * Labels for the contact details panel.
 *
 * Here rather than inline in the component for the same reason as every other
 * string on the site: copy changes for editorial reasons and should never
 * require touching rendering logic.
 */
export const CONTACT_PANEL = {
  socialsHeading: 'Elsewhere',
  resumeHeading: 'Prefer the short version?',
  resumeBody: 'The CV covers the same ground in one page.',
  resumeCta: 'Download résumé',
}

/**
 * Copy for each submission state.
 *
 * These are fallbacks. The endpoint returns its own message for every outcome
 * it knows about — validation, rate limiting, delivery failure — and the form
 * shows that instead, because the server knows which of them happened and the
 * client does not. `error` is what appears when the request never arrived at
 * all: an offline browser, a DNS failure, a blocked request.
 */
export const FORM_MESSAGES = {
  success: 'Thanks — your message is on its way. I will reply within two working days.',
  error: 'Could not reach the server. Check your connection, or email me directly and I will pick it up.',
  submitting: 'Sending…',
}
