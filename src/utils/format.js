/**
 * Formatting helpers.
 *
 * Presentation of stored values. Data files hold machine-readable values
 * ('2024-03'); these turn them into display text at render time, so the format
 * is defined once and is localisable.
 */

/**
 * Parse an ISO 'YYYY-MM' or 'YYYY-MM-DD' string into a Date.
 *
 * Built explicitly rather than via `new Date('2024-03')` because that form is
 * parsed as UTC midnight — which lands on the *previous month* for anyone west
 * of Greenwich, producing an off-by-one that only appears for some visitors.
 * Constructing from parts keeps it in local time.
 *
 * @param {string} iso
 * @returns {Date|null} Null when the input is unparseable.
 */
function parseIsoMonth(iso) {
  if (typeof iso !== 'string') return null

  const [year, month = '1', day = '1'] = iso.split('-')
  const date = new Date(Number(year), Number(month) - 1, Number(day))

  return Number.isNaN(date.getTime()) ? null : date
}

/**
 * Format a single date as 'Mar 2024'.
 *
 * @param {string} iso ISO 'YYYY-MM'.
 * @param {object} [options]
 * @param {string} [options.locale='en'] BCP 47 tag.
 * @param {'short'|'long'} [options.month='short']
 * @returns {string} Empty string for unparseable input, so a broken date never
 *   renders as 'Invalid Date' or 'NaN' in the UI.
 */
export function formatMonthYear(iso, { locale = 'en', month = 'short' } = {}) {
  const date = parseIsoMonth(iso)
  if (!date) return ''

  return new Intl.DateTimeFormat(locale, { month, year: 'numeric' }).format(date)
}

/**
 * Format a start/end pair as a range: 'Mar 2024 — Present'.
 *
 * A null `end` means the role is current, so "Present" is computed rather than
 * typed into the data — a current job then never silently goes stale.
 *
 * @param {string} start ISO 'YYYY-MM'.
 * @param {string|null} [end] ISO 'YYYY-MM', or null for ongoing.
 * @param {object} [options]
 * @param {string} [options.locale='en']
 * @param {string} [options.present='Present'] Label for an ongoing entry.
 * @param {string} [options.separator=' — '] Em dash, not a hyphen.
 * @returns {string}
 *
 * @example
 * formatDateRange('2024-01', null)      // 'Jan 2024 — Present'
 * formatDateRange('2022-01', '2023-12') // 'Jan 2022 — Dec 2023'
 */
export function formatDateRange(start, end, options = {}) {
  const { locale = 'en', present = 'Present', separator = ' — ' } = options

  const from = formatMonthYear(start, { locale })
  if (!from) return ''

  const to = end ? formatMonthYear(end, { locale }) : present

  return `${from}${separator}${to}`
}

/**
 * Duration between two dates, as '2 yrs 3 mos'.
 *
 * @param {string} start ISO 'YYYY-MM'.
 * @param {string|null} [end] Defaults to now when null.
 * @returns {string} Empty string if the input is unparseable or the range is
 *   inverted.
 */
export function formatDuration(start, end) {
  const from = parseIsoMonth(start)
  if (!from) return ''

  const to = end ? parseIsoMonth(end) : new Date()
  if (!to || to < from) return ''

  const totalMonths =
    (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth()) + 1

  const years = Math.floor(totalMonths / 12)
  const months = totalMonths % 12

  const parts = []
  if (years) parts.push(`${years} yr${years === 1 ? '' : 's'}`)
  if (months) parts.push(`${months} mo${months === 1 ? '' : 's'}`)

  return parts.join(' ')
}

/**
 * Zero-pad a number for display: 1 → '01'.
 *
 * For the numbered indices on process steps and project lists, where '01' and
 * '10' must occupy the same width or the column edge visibly wobbles.
 *
 * @param {number} value
 * @param {number} [length=2]
 * @returns {string}
 */
export function padIndex(value, length = 2) {
  return String(value).padStart(length, '0')
}

/**
 * Strip the protocol and trailing slash from a URL for display.
 *
 * Showing 'example.com' instead of 'https://example.com/' is a small detail
 * that keeps link text clean in a footer or contact block.
 *
 * @param {string} url
 * @returns {string} The original string if it is not a valid URL.
 */
export function formatUrlLabel(url) {
  try {
    const { hostname, pathname } = new URL(url)
    const path = pathname === '/' ? '' : pathname.replace(/\/$/, '')
    return `${hostname.replace(/^www\./, '')}${path}`
  } catch {
    return url
  }
}
