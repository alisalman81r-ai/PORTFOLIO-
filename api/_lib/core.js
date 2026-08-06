import {
  HONEYPOT_FIELD,
  MIN_SUBMIT_MS,
  validateContact,
} from '../../shared/contactSchema.js'
import { normalise, singleLine } from './sanitize.js'
import { clientIdentity, rateLimit } from './rateLimit.js'
import { createStore } from './db/index.js'
import { isEmailConfigured, sendConfirmation, sendInquiry } from './email/send.js'
import { confirmationEmail, inquiryEmail } from './email/templates.js'

/**
 * The contact endpoint, with no framework in it.
 *
 * WHY THIS IS SEPARATE FROM `api/contact.js`
 * This project is Vite, so the endpoint is a Vercel serverless function. If it
 * ever moves to Next.js, Netlify, Cloudflare or an Express server, that is a
 * different request and response object every time — and every one of them can
 * be adapted in about ten lines as long as the logic does not care. So this
 * takes a plain `{ method, headers, body }` and returns a plain
 * `{ status, body }`, and `api/contact.js` is the adapter.
 *
 * It also means the whole endpoint is testable by calling a function, with no
 * server, no ports and no HTTP mocking.
 *
 * THE ORDER OF CHECKS IS THE SECURITY DESIGN
 * Cheapest and most certain first, so an attacker cannot make the expensive
 * work happen:
 *
 *   1. Method          — wrong verb costs nothing to reject
 *   2. Payload size    — before parsing, so a huge body is never held in memory
 *   3. Honeypot        — no I/O, and catches most drive-by spam
 *   4. Timing          — no I/O, catches scripted posts that skip the honeypot
 *   5. Rate limit      — one map read, or one Redis round trip
 *   6. Validation      — pure, and the last gate before anything leaves
 *   7. Store, then send
 *
 * Every rejection returns the same shape, so the client has one thing to parse.
 */

/** Largest body accepted, in bytes. Comfortably above a full valid submission. */
const MAX_BODY_BYTES = 16 * 1024

const json = (status, body) => ({ status, body })

/**
 * Bot submissions are accepted, not rejected.
 *
 * A 400 tells a script exactly which check it failed, and the next attempt
 * leaves that field alone. A 200 with nothing behind it teaches it nothing and
 * costs us nothing — the enquiry is simply discarded.
 */
const silentlyAccepted = () => json(200, { ok: true, message: 'Thanks — your message is on its way.' })

/**
 * @param {{method: string, headers: Record<string, string|string[]|undefined>, body: unknown, rawLength?: number}} request
 * @returns {Promise<{status: number, body: object}>}
 */
export async function handleContact(request) {
  const { method, headers = {}, body, rawLength } = request

  // ── 1. Method ─────────────────────────────────────────────────────────────
  if (method !== 'POST') {
    return json(405, { ok: false, error: 'method_not_allowed', message: 'Use POST.' })
  }

  // ── 2. Payload size ───────────────────────────────────────────────────────
  const declared = Number(headers['content-length'] ?? rawLength ?? 0)
  if (declared > MAX_BODY_BYTES) {
    return json(413, {
      ok: false,
      error: 'payload_too_large',
      message: 'That message is too long to send. Please shorten it.',
    })
  }

  if (!body || typeof body !== 'object') {
    return json(400, {
      ok: false,
      error: 'invalid_body',
      message: 'Could not read that submission. Please try again.',
    })
  }

  // ── 3. Honeypot ───────────────────────────────────────────────────────────
  if (String(body[HONEYPOT_FIELD] ?? '').trim()) {
    return silentlyAccepted()
  }

  // ── 4. Timing ─────────────────────────────────────────────────────────────
  // `renderedAt` is stamped by the client when the form mounts. A missing or
  // unparseable value is treated as fine rather than as an attack: an older
  // cached bundle, a blocked script, or a prefilled autofill can all produce it,
  // and rejecting real people to catch a bot that the honeypot already catches
  // is the wrong trade.
  const renderedAt = Number(body.renderedAt)
  if (Number.isFinite(renderedAt) && renderedAt > 0) {
    const elapsed = Date.now() - renderedAt
    if (elapsed >= 0 && elapsed < MIN_SUBMIT_MS) {
      return silentlyAccepted()
    }
  }

  // ── 5. Rate limit ─────────────────────────────────────────────────────────
  const identity = clientIdentity(headers)
  const limit = await rateLimit(identity, 'contact')

  if (!limit.allowed) {
    return json(429, {
      ok: false,
      error: 'rate_limited',
      retryAfterSeconds: Math.ceil(limit.resetMs / 1000),
      message: 'That is a lot of messages in a short time. Please try again shortly.',
    })
  }

  // ── 6. Validation ─────────────────────────────────────────────────────────
  const { valid, errors, values } = validateContact(body)

  if (!valid) {
    // Field-level errors are returned so the client can attach them to the
    // right inputs. They describe the rules the client already enforces, so
    // nothing is disclosed that the page did not already know.
    return json(400, {
      ok: false,
      error: 'validation_failed',
      errors,
      message: 'Some details need checking before this can send.',
    })
  }

  // ── 7. Normalise, store, send ─────────────────────────────────────────────
  const enquiry = {
    name: singleLine(values.name, 80),
    email: singleLine(values.email, 160).toLowerCase(),
    company: singleLine(values.company, 120),
    service: singleLine(values.service, 40),
    budget: singleLine(values.budget, 40),
    timeline: singleLine(values.timeline, 40),
    subject: singleLine(values.subject, 120),
    message: normalise(values.message, 2000),
    ip: identity,
    userAgent: singleLine(headers['user-agent'], 300),
  }

  if (!isEmailConfigured()) {
    // Loud, and a 500. A form that accepts submissions it cannot deliver is the
    // worst outcome available here — it looks like success to the visitor and
    // nobody ever learns they wrote.
    console.error(
      '[contact] RESEND_API_KEY or CONTACT_TO_EMAIL is missing — cannot deliver enquiries.',
    )
    return json(500, {
      ok: false,
      error: 'email_not_configured',
      message: 'The contact form is not available right now. Please email me directly.',
    })
  }

  // Storage first, so the notification can quote the id — but never fatally.
  // An enquiry that was emailed but not stored still reached a human.
  let storedId = null
  const store = createStore()
  try {
    const stored = await store.save(enquiry)
    storedId = stored.id
  } catch (error) {
    console.error(`[contact] storage failed (${store.name}):`, error.message)
  }

  const receivedAt = new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC'

  try {
    await sendInquiry(inquiryEmail({ ...enquiry, id: storedId, receivedAt }), {
      replyTo: enquiry.email,
      senderName: enquiry.name,
    })
  } catch (error) {
    console.error('[contact] notification failed:', error.message)
    return json(502, {
      ok: false,
      error: 'delivery_failed',
      message: 'That did not send. Please email me directly and I will pick it up.',
    })
  }

  const confirmation = await sendConfirmation(
    confirmationEmail(enquiry, {
      ownerName: process.env.CONTACT_OWNER_NAME || 'Portfolio',
      siteUrl: process.env.SITE_URL || '',
      replyWithin: process.env.CONTACT_REPLY_WITHIN || 'two working days',
    }),
    { to: enquiry.email },
  )

  if (!confirmation.sent && confirmation.error) {
    console.warn('[contact] confirmation failed (not fatal):', confirmation.error)
  }

  return json(200, {
    ok: true,
    id: storedId,
    stored: store.isConfigured,
    confirmationSent: confirmation.sent,
    message: 'Thanks — your message is on its way.',
  })
}
