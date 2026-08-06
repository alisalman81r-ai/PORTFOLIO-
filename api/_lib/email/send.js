/**
 * Email delivery — Resend.
 *
 * WHY `fetch` AND NOT THE `resend` PACKAGE
 * The SDK is a thin wrapper over one POST to `/emails`. Using it would add a
 * dependency, a version to keep current, and cold-start weight to a function
 * whose entire job is that one request. If the API surface used here grows past
 * "send an email", install the SDK — until then this is less code and less to
 * go wrong.
 *
 * THE TWO SENDS ARE NOT EQUALLY IMPORTANT, AND THE CODE SAYS SO
 * The notification is the enquiry. If it fails, nobody learns the visitor tried
 * to make contact, and the request must fail so they know to try another way.
 * The confirmation is a courtesy. If *it* fails, the enquiry still arrived —
 * failing the request over it would tell the visitor their message was lost
 * when it was not, and they would send it again.
 *
 * So `sendInquiry` throws and `sendConfirmation` swallows. That asymmetry is
 * deliberate and is the most important thing in this file.
 */

const ENDPOINT = 'https://api.resend.com/emails'

/**
 * Is email configured at all?
 *
 * Checked before anything else in the handler: a contact form that silently
 * discards submissions because a key is missing is the worst possible failure,
 * because it looks like success from every angle.
 */
export function isEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_TO_EMAIL)
}

/**
 * POST one email to Resend.
 *
 * @param {object} payload
 * @returns {Promise<{id: string}>}
 * @throws When the API rejects it.
 */
async function post(payload) {
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    // Without a timeout a hung provider holds the function open until the
    // platform kills it, and the visitor watches a spinner the whole time.
    signal: AbortSignal.timeout(10_000),
  })

  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    throw new Error(`resend ${response.status}: ${detail.slice(0, 300)}`)
  }

  return response.json()
}

/**
 * Send the enquiry notification. Throws on failure — see the note above.
 *
 * `reply_to` is the sender's address, so replying from the inbox goes to them
 * rather than to the sending domain. `from` must be a domain verified in
 * Resend; it is never the visitor's address, because sending as someone else
 * fails SPF and lands the mail in spam.
 *
 * @param {{subject: string, html: string, text: string}} content
 * @param {{replyTo: string, senderName: string}} meta
 */
export async function sendInquiry(content, meta) {
  return post({
    from: process.env.CONTACT_FROM_EMAIL || 'Portfolio <onboarding@resend.dev>',
    to: [process.env.CONTACT_TO_EMAIL],
    reply_to: meta.replyTo,
    subject: content.subject,
    html: content.html,
    text: content.text,
  })
}

/**
 * Send the confirmation to the visitor. Never throws.
 *
 * Returns a result object instead, so the handler can log the failure without
 * having to decide whether it was fatal — it is not.
 *
 * @param {{subject: string, html: string, text: string}} content
 * @param {{to: string}} meta
 * @returns {Promise<{sent: boolean, error?: string}>}
 */
export async function sendConfirmation(content, meta) {
  if (process.env.CONTACT_SEND_CONFIRMATION === 'false') {
    return { sent: false }
  }

  try {
    await post({
      from: process.env.CONTACT_FROM_EMAIL || 'Portfolio <onboarding@resend.dev>',
      to: [meta.to],
      reply_to: process.env.CONTACT_TO_EMAIL,
      subject: content.subject,
      html: content.html,
      text: content.text,
    })
    return { sent: true }
  } catch (error) {
    return { sent: false, error: error.message }
  }
}
