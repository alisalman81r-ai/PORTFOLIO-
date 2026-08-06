/**
 * Input sanitisation.
 *
 * WHAT SANITISING DOES AND DOES NOT MEAN HERE
 * It does not mean stripping tags and calling the value safe. Escaping is
 * contextual: the same string needs different treatment in HTML, in a SQL
 * query, and in an email header, and a single "clean" function that pretends
 * otherwise is how injection bugs survive code review.
 *
 * So this module does two narrow jobs:
 *
 *   1. `normalise` removes control characters and caps length — defence against
 *      malformed input reaching the database or an email header.
 *   2. `escapeHtml` escapes for exactly one context: interpolation into an HTML
 *      email body. It is applied at the template, at the moment of use, never
 *      "on the way in".
 *
 * Storage is parameterised — PostgREST is sent JSON, never SQL — so there is no
 * SQL escaping here and there should never need to be.
 */

/**
 * Characters with no business in form input.
 *
 * C0 controls except tab, newline and carriage return; DEL; the C1 range; and
 * the Unicode line and paragraph separators.
 *
 * Built with `new RegExp` from a plain string rather than written as a regex
 * literal. The escape sequences survive being copied through a shell or an
 * editor that way; typed as literals into a character class they are real
 * control characters in the source, invisible in every diff, and silently
 * corrupted the first time the file is touched by a tool that normalises them.
 */
const CONTROL_CHARS = new RegExp(
  // oxlint-disable-next-line no-control-regex -- matching these is the purpose
  '[\\u0000-\\u0008\\u000B\\u000C\\u000E-\\u001F\\u007F-\\u009F\\u2028\\u2029]',
  'g',
)

/**
 * Strip control characters, collapse runaway whitespace, trim, and cap length.
 *
 * A CR or LF in a value that later reaches an email header is the classic
 * header-injection vector, which is why anything destined for a header goes
 * through `singleLine` rather than this.
 *
 * @param {unknown} value
 * @param {number} [maxLength] Hard cap applied after trimming.
 * @returns {string}
 */
export function normalise(value, maxLength) {
  let text = typeof value === 'string' ? value : value == null ? '' : String(value)

  text = text.replace(CONTROL_CHARS, '')
  // Collapse absurd runs of spaces and blank lines. Not cosmetic: it is what
  // stops a message padded with 50,000 spaces from passing a length check.
  text = text.replace(/[ \t]{3,}/g, '  ').replace(/\n{4,}/g, '\n\n\n')
  text = text.trim()

  if (maxLength && text.length > maxLength) text = text.slice(0, maxLength)

  return text
}

/**
 * Collapse to a single line, then normalise.
 *
 * For values that end up on one header line — a subject, a display name. The
 * newline removal happens before `normalise`, so the result cannot contain a
 * line break under any input.
 *
 * @param {unknown} value
 * @param {number} [maxLength]
 * @returns {string}
 */
export function singleLine(value, maxLength) {
  const flattened = String(value ?? '').replace(/[\r\n]+/g, ' ')
  return normalise(flattened, maxLength)
}

/**
 * Escape for interpolation into HTML.
 *
 * Applied at the point of use in the email templates. Five characters, including
 * both quote forms — an unescaped double quote inside an attribute is enough to
 * break out of it.
 *
 * @param {unknown} value
 * @returns {string}
 */
export function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/**
 * Escape, then convert newlines to `<br>`, for a message body in an HTML email.
 *
 * Escaping happens first. The other order would escape the `<br>` tags this
 * function had just inserted.
 *
 * @param {unknown} value
 * @returns {string}
 */
export function escapeHtmlMultiline(value) {
  return escapeHtml(value).replace(/\r?\n/g, '<br>')
}
