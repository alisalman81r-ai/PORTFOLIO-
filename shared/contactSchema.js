/**
 * Contact form contract — the single definition of what a valid enquiry is.
 *
 * WHY THIS LIVES OUTSIDE `src/`
 * The browser and the server both have to validate this form, and they have to
 * agree. Two copies of the rules is the classic way a form ends up accepting a
 * 3,000-character message on the client and rejecting it on the server, or
 * worse, the reverse. This file is imported by both — `src/data/contact.js` for
 * the UI, `api/_lib/core.js` for the endpoint — so there is one place to change
 * a length limit and no way for the two sides to drift.
 *
 * It is deliberately dependency-free and framework-free: no React, no imports,
 * plain ESM. That is what lets a Node serverless function and a Vite browser
 * bundle both consume it without a build step in between.
 *
 * CLIENT VALIDATION IS A COURTESY. SERVER VALIDATION IS THE RULE.
 * Everything here runs in the browser to give fast feedback, and every bit of it
 * runs again on the server, because anything sent from a browser can be forged.
 * The client copy exists so a person is told about a typo before a round trip;
 * it is not a security boundary and is never treated as one.
 */

/** Permissive on purpose — see the note on `validateField`. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Option lists for the three qualifying selects.
 *
 * `value` is what gets stored and emailed; `label` is what a person reads. They
 * are separate so the copy can be rewritten without migrating stored rows.
 *
 * The empty-string first option is the unselected state. It is a real option
 * rather than a `placeholder` attribute, because `<select>` has no placeholder
 * and the alternative — defaulting to the first real value — silently puts
 * words in someone's mouth.
 */
export const SERVICE_OPTIONS = [
  { value: '', label: 'Select a service' },
  { value: 'frontend', label: 'Frontend development' },
  { value: 'full-stack', label: 'Full stack web development' },
  { value: 'responsive', label: 'Responsive website build' },
  { value: 'figma-to-code', label: 'UI implementation from Figma' },
  { value: 'performance', label: 'Performance optimisation' },
  { value: 'maintenance', label: 'Ongoing maintenance' },
  { value: 'design', label: 'Design or branding work' },
  { value: 'other', label: 'Something else' },
]

export const BUDGET_OPTIONS = [
  { value: '', label: 'Prefer not to say' },
  { value: 'under-1k', label: 'Under $1,000' },
  { value: '1k-5k', label: '$1,000 – $5,000' },
  { value: '5k-10k', label: '$5,000 – $10,000' },
  { value: '10k-plus', label: '$10,000+' },
  { value: 'undecided', label: 'Not decided yet' },
]

export const TIMELINE_OPTIONS = [
  { value: '', label: 'Prefer not to say' },
  { value: 'asap', label: 'As soon as possible' },
  { value: '1-month', label: 'Within a month' },
  { value: '1-3-months', label: 'One to three months' },
  { value: 'flexible', label: 'Flexible' },
  { value: 'exploring', label: 'Just exploring' },
]

/**
 * Field constraints. Presentation — placeholders, hints, autocomplete, grid
 * spans — lives in `src/data/contact.js` and merges with this.
 *
 * @typedef {object} FieldSchema
 * @property {string} id
 * @property {string} label
 * @property {'text'|'email'|'textarea'|'select'} type
 * @property {boolean} required
 * @property {number} [minLength]
 * @property {number} [maxLength]
 * @property {{value: string, label: string}[]} [options] Select only. A value
 *   outside this list is rejected — the browser's `<select>` cannot produce one,
 *   but a script posting directly can.
 */

/** @type {FieldSchema[]} */
export const CONTACT_SCHEMA = [
  { id: 'name', label: 'Name', type: 'text', required: true, minLength: 2, maxLength: 80 },
  { id: 'email', label: 'Email', type: 'email', required: true, maxLength: 160 },
  { id: 'company', label: 'Company', type: 'text', required: false, maxLength: 120 },
  { id: 'service', label: 'Service required', type: 'select', required: true, options: SERVICE_OPTIONS },
  { id: 'budget', label: 'Estimated budget', type: 'select', required: false, options: BUDGET_OPTIONS },
  { id: 'timeline', label: 'Project timeline', type: 'select', required: false, options: TIMELINE_OPTIONS },
  { id: 'subject', label: 'Subject', type: 'text', required: true, minLength: 3, maxLength: 120 },
  { id: 'message', label: 'Message', type: 'textarea', required: true, minLength: 20, maxLength: 2000 },
]

/** Field ids, for iterating without importing the whole schema. */
export const CONTACT_FIELD_IDS = CONTACT_SCHEMA.map((field) => field.id)

/**
 * Name of the honeypot field.
 *
 * A hidden input no human can see or tab into. Bots fill every field they find,
 * so a value here means the submission is automated. Named to look attractive
 * to a scraper — `company_website` reads like a field worth filling.
 */
export const HONEYPOT_FIELD = 'company_website'

/**
 * Minimum time, in milliseconds, between the form rendering and being submitted.
 *
 * A human cannot read eight fields, decide on a budget and write twenty
 * characters of message in under three seconds. A script can do it in under
 * fifty milliseconds. This catches the automated submissions that are careful
 * enough to leave the honeypot alone, and it costs a real person nothing —
 * nobody submits this form that fast.
 */
export const MIN_SUBMIT_MS = 3000

/**
 * Validate one value against its schema entry.
 *
 * Order matters: `required` is checked first, so an empty field reports "this is
 * required" rather than "must be at least 20 characters" — technically true and
 * completely unhelpful.
 *
 * The email pattern is deliberately permissive. The only definitive test of an
 * address is sending to it, and every "strict" regex on the internet rejects
 * valid addresses: apostrophes, plus-addressing, new TLDs. This catches genuine
 * typos and lets everything else through, which is the right trade here — a
 * false rejection loses a real enquiry, a false accept costs one bounced email.
 *
 * @param {string} value
 * @param {FieldSchema} field
 * @returns {string} Error message, or an empty string when valid.
 */
export function validateField(value, field) {
  const trimmed = String(value ?? '').trim()

  if (field.required && !trimmed) {
    return `${field.label} is required.`
  }

  // Everything below applies only to a field with content. An optional field
  // left blank is valid, and length rules must not fire on it.
  if (!trimmed) return ''

  if (field.type === 'email' && !EMAIL_PATTERN.test(trimmed)) {
    return 'Enter a valid email address.'
  }

  if (field.type === 'select' && field.options) {
    const allowed = field.options.map((option) => option.value)
    if (!allowed.includes(trimmed)) {
      return `Choose one of the listed options for ${field.label.toLowerCase()}.`
    }
  }

  if (field.minLength && trimmed.length < field.minLength) {
    return `${field.label} must be at least ${field.minLength} characters.`
  }

  if (field.maxLength && trimmed.length > field.maxLength) {
    return `${field.label} must be ${field.maxLength} characters or fewer.`
  }

  return ''
}

/**
 * Validate a whole submission.
 *
 * Returns trimmed values alongside the errors, so the caller stores what was
 * validated rather than the raw input — otherwise leading whitespace passes a
 * length check and then gets written to the database.
 *
 * Unknown keys are dropped rather than rejected. A submission carrying an extra
 * field is far more likely to be a stale cached client than an attack, and
 * silently ignoring it is both safer and kinder than a 400.
 *
 * @param {Record<string, unknown>} input
 * @returns {{valid: boolean, errors: Record<string, string>, values: Record<string, string>}}
 */
export function validateContact(input) {
  const errors = {}
  const values = {}

  for (const field of CONTACT_SCHEMA) {
    const raw = input?.[field.id]
    const value = typeof raw === 'string' ? raw : raw == null ? '' : String(raw)
    const error = validateField(value, field)

    if (error) errors[field.id] = error
    values[field.id] = value.trim()
  }

  return { valid: Object.keys(errors).length === 0, errors, values }
}

/**
 * Human-readable label for a stored select value.
 *
 * Used by the email templates so a notification reads "Full stack web
 * development" rather than "full-stack". Falls back to the raw value, which is
 * what you want if an option is renamed after a row was written.
 *
 * @param {string} fieldId
 * @param {string} value
 * @returns {string}
 */
export function optionLabel(fieldId, value) {
  const field = CONTACT_SCHEMA.find((entry) => entry.id === fieldId)
  const match = field?.options?.find((option) => option.value === value)
  return match?.label ?? value
}
