import { HONEYPOT_FIELD } from '@shared/contactSchema.js'

/**
 * POST the contact form to the API.
 *
 * WHY THIS IS NOT INSIDE THE COMPONENT
 * The component's job is to render a form. This is network access, error
 * translation and a timeout — none of which need React, all of which are
 * easier to reason about and to test as a plain async function. It also means
 * the endpoint URL appears in exactly one place.
 *
 * THE ERROR CONTRACT
 * `useForm` turns a rejection into the error status. This throws an `Error`
 * carrying two extra properties, both optional:
 *
 *   `fieldErrors` — per-field messages from the server, attached to the inputs
 *   `message`     — text to show in the status line
 *
 * That is what lets a server-side rejection land on the right field instead of
 * as a banner saying something went wrong somewhere.
 */

const ENDPOINT = '/api/contact'

/** Give up after this long. A form that spins forever reads as broken. */
const TIMEOUT_MS = 20_000

/**
 * @param {Record<string, string> & {renderedAt: number}} values
 * @param {string} [honeypotValue] Whatever was typed into the hidden field.
 * @returns {Promise<{message: string}>}
 * @throws {Error & {fieldErrors?: Record<string, string>}}
 */
export async function submitEnquiry(values, honeypotValue = '') {
  let response

  try {
    response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...values, [HONEYPOT_FIELD]: honeypotValue }),
      // Without this a hung request leaves the button disabled and the spinner
      // turning until the tab is closed.
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
  } catch (cause) {
    // Offline, DNS failure, blocked by an extension, or the timeout above. The
    // request never reached the server, so there is nothing to parse and no
    // field to blame.
    const error = new Error('')
    error.cause = cause
    throw error
  }

  // A non-JSON body means something other than the API answered — a host error
  // page, a proxy, an offline service worker. Treated as a failure with no
  // field errors rather than crashing on the parse.
  const payload = await response.json().catch(() => null)

  if (!response.ok || !payload?.ok) {
    const error = new Error(payload?.message ?? '')
    if (payload?.errors) error.fieldErrors = payload.errors
    error.status = response.status
    throw error
  }

  return payload
}
