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
 * @property {'text'|'email'|'textarea'} type
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

/** @type {FormFieldConfig[]} */
export const FORM_FIELDS = [
  {
    id: 'name',
    label: 'Name',
    type: 'text',
    placeholder: 'Your name',
    autoComplete: 'name',
    required: true,
    minLength: 2,
    maxLength: 80,
  },
  {
    id: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'you@company.com',
    autoComplete: 'email',
    required: true,
    maxLength: 160,
  },
  {
    id: 'subject',
    label: 'Subject',
    type: 'text',
    placeholder: 'What is this about?',
    autoComplete: 'off',
    required: true,
    fullWidth: true,
    minLength: 3,
    maxLength: 120,
  },
  {
    id: 'message',
    label: 'Message',
    type: 'textarea',
    placeholder: 'What are you building, and what does done look like?',
    required: true,
    minLength: 20,
    maxLength: 2000,
    rows: 6,
    hint: 'The more context, the more useful my reply.',
  },
]

/**
 * Name of the honeypot field.
 *
 * A hidden input no human can see or tab into. Bots fill every field they find,
 * so a value here means the submission is automated — it is accepted silently
 * rather than rejected, since telling a bot it failed only teaches it to try
 * again. Costs nothing and catches the majority of drive-by spam without a
 * CAPTCHA, which is a real accessibility burden.
 */
export const HONEYPOT_FIELD = 'company_website'

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

/** Copy for each submission state. Kept out of the component. */
export const FORM_MESSAGES = {
  success: 'Thanks — your message is on its way. I will reply within two working days.',
  error: 'Something went wrong sending that. Email me directly and I will pick it up.',
  submitting: 'Sending…',
}
