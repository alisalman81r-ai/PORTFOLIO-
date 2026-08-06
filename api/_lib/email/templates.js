import { escapeHtml, escapeHtmlMultiline } from '../sanitize.js'
import { optionLabel } from '../../../shared/contactSchema.js'

/**
 * HTML email templates.
 *
 * WHY THESE LOOK LIKE 2004 HTML
 * Email clients are not browsers. Outlook renders with Word's engine, Gmail
 * strips `<style>` blocks in some contexts, and support for flexbox, grid and
 * custom properties ranges from partial to absent. So: tables for layout,
 * inline styles, hex colours, no web fonts. This is the one place in this
 * codebase where that is correct rather than dated.
 *
 * THE PALETTE IS THE PORTFOLIO'S, CONVERTED
 * The site's tokens are `oklch`, which almost nothing in email supports. These
 * are the same colours resolved to hex — the light theme, because an email that
 * arrives as a black rectangle in a white inbox reads as broken, and most
 * clients ignore `prefers-color-scheme` anyway.
 *
 * EVERY INTERPOLATION IS ESCAPED
 * Values reaching these templates have been validated and normalised, but
 * escaping happens here regardless: escaping is contextual, and this is the
 * context. `escapeHtmlMultiline` is used for the message body only, where the
 * line breaks a person typed should survive as `<br>`.
 */

const COLOR = {
  ink: '#232326',
  muted: '#6b6b70',
  faint: '#8a8a90',
  accent: '#9a6b00',
  line: '#e4e4e7',
  surface: '#ffffff',
  canvas: '#f7f7f8',
}

const FONT =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"

/**
 * Page shell.
 *
 * The outer table with `bgcolor` is what gives Outlook a background; the inner
 * fixed-width table is what stops the content stretching to the window width in
 * clients that ignore `max-width`.
 */
function shell({ preheader, title, body, footer }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background-color:${COLOR.canvas};font-family:${FONT};">
  <!-- Preheader: the grey line an inbox shows after the subject. Hidden in the
       body itself, because it is already visible in the list view. -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${COLOR.canvas}">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:100%;background-color:${COLOR.surface};border:1px solid ${COLOR.line};border-radius:12px;">
          <tr>
            <td style="padding:32px 32px 0;">
              <p style="margin:0;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:${COLOR.accent};font-weight:600;">
                ${escapeHtml(title)}
              </p>
            </td>
          </tr>
          ${body}
          <tr>
            <td style="padding:24px 32px 32px;border-top:1px solid ${COLOR.line};">
              <p style="margin:0;font-size:12px;line-height:1.6;color:${COLOR.faint};">
                ${footer}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

/** One label/value row. Skipped entirely when the value is empty. */
function row(label, value) {
  if (!value) return ''
  return `<tr>
    <td style="padding:0 0 14px;">
      <p style="margin:0 0 2px;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:${COLOR.faint};">${escapeHtml(label)}</p>
      <p style="margin:0;font-size:15px;line-height:1.5;color:${COLOR.ink};">${escapeHtml(value)}</p>
    </td>
  </tr>`
}

/**
 * The notification you receive.
 *
 * Written to be answerable from a phone: who, what they want, how much, how
 * soon, then the message. The reply-to is set to the sender on the send call,
 * so hitting reply goes to them rather than to the sending domain.
 *
 * @param {import('../db/index').Enquiry & {id?: string|null, receivedAt: string}} enquiry
 */
export function inquiryEmail(enquiry) {
  const body = `
    <tr>
      <td style="padding:12px 32px 0;">
        <h1 style="margin:0 0 4px;font-size:22px;line-height:1.3;color:${COLOR.ink};font-weight:600;">
          ${escapeHtml(enquiry.subject)}
        </h1>
        <p style="margin:0 0 24px;font-size:14px;color:${COLOR.muted};">
          from ${escapeHtml(enquiry.name)}${enquiry.company ? ` at ${escapeHtml(enquiry.company)}` : ''}
        </p>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          ${row('Email', enquiry.email)}
          ${row('Company', enquiry.company)}
          ${row('Service', optionLabel('service', enquiry.service))}
          ${row('Budget', optionLabel('budget', enquiry.budget))}
          ${row('Timeline', optionLabel('timeline', enquiry.timeline))}
        </table>

        <div style="margin:8px 0 24px;padding:20px;background-color:${COLOR.canvas};border-radius:8px;border:1px solid ${COLOR.line};">
          <p style="margin:0 0 8px;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:${COLOR.faint};">Message</p>
          <p style="margin:0;font-size:15px;line-height:1.65;color:${COLOR.ink};">${escapeHtmlMultiline(enquiry.message)}</p>
        </div>

        <a href="mailto:${escapeHtml(enquiry.email)}?subject=${encodeURIComponent('Re: ' + enquiry.subject)}"
           style="display:inline-block;padding:12px 22px;background-color:${COLOR.ink};color:#ffffff;text-decoration:none;border-radius:999px;font-size:14px;font-weight:600;">
          Reply to ${escapeHtml(enquiry.name)}
        </a>
      </td>
    </tr>`

  const footer = [
    `Received ${escapeHtml(enquiry.receivedAt)}`,
    enquiry.id ? `Enquiry ${escapeHtml(enquiry.id)}` : 'Not stored — no database configured',
  ].join(' &middot; ')

  const text = [
    `New enquiry: ${enquiry.subject}`,
    '',
    `Name:     ${enquiry.name}`,
    `Email:    ${enquiry.email}`,
    enquiry.company ? `Company:  ${enquiry.company}` : '',
    `Service:  ${optionLabel('service', enquiry.service)}`,
    enquiry.budget ? `Budget:   ${optionLabel('budget', enquiry.budget)}` : '',
    enquiry.timeline ? `Timeline: ${optionLabel('timeline', enquiry.timeline)}` : '',
    '',
    'Message:',
    enquiry.message,
    '',
    `Received ${enquiry.receivedAt}`,
  ]
    .filter((line) => line !== '')
    .join('\n')

  return {
    subject: `New enquiry — ${enquiry.subject}`,
    html: shell({
      preheader: `${enquiry.name}: ${enquiry.message.slice(0, 120)}`,
      title: 'New enquiry',
      body,
      footer,
    }),
    text,
  }
}

/**
 * The confirmation the sender receives.
 *
 * Two jobs, and only two: prove the message arrived, and set an expectation for
 * the reply. It quotes their message back so they have a record, and it does
 * not try to sell anything — a confirmation email that pitches is the fastest
 * way to be marked as spam.
 *
 * @param {import('../db/index').Enquiry} enquiry
 * @param {{ownerName: string, siteUrl: string, replyWithin: string}} site
 */
export function confirmationEmail(enquiry, site) {
  const body = `
    <tr>
      <td style="padding:12px 32px 0;">
        <h1 style="margin:0 0 12px;font-size:22px;line-height:1.3;color:${COLOR.ink};font-weight:600;">
          Thanks — your message arrived
        </h1>
        <p style="margin:0 0 20px;font-size:15px;line-height:1.65;color:${COLOR.muted};">
          Hi ${escapeHtml(enquiry.name.split(' ')[0])}, this is an automatic confirmation that your
          message reached me. I read every enquiry personally and will reply within
          ${escapeHtml(site.replyWithin)}.
        </p>

        <div style="margin:0 0 20px;padding:20px;background-color:${COLOR.canvas};border-radius:8px;border:1px solid ${COLOR.line};">
          <p style="margin:0 0 8px;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:${COLOR.faint};">
            What you sent
          </p>
          <p style="margin:0 0 10px;font-size:15px;font-weight:600;color:${COLOR.ink};">${escapeHtml(enquiry.subject)}</p>
          <p style="margin:0;font-size:14px;line-height:1.65;color:${COLOR.muted};">${escapeHtmlMultiline(enquiry.message)}</p>
        </div>

        <p style="margin:0 0 24px;font-size:14px;line-height:1.65;color:${COLOR.muted};">
          If anything is wrong or you want to add to it, reply to this email — it comes straight to me.
        </p>
      </td>
    </tr>`

  const text = [
    'Thanks — your message arrived',
    '',
    `Hi ${enquiry.name.split(' ')[0]}, this is an automatic confirmation that your message`,
    `reached me. I read every enquiry personally and will reply within ${site.replyWithin}.`,
    '',
    'What you sent',
    `Subject: ${enquiry.subject}`,
    '',
    enquiry.message,
    '',
    'If anything is wrong or you want to add to it, just reply to this email.',
    '',
    `— ${site.ownerName}`,
    site.siteUrl,
  ].join('\n')

  return {
    subject: `Thanks for getting in touch — ${enquiry.subject}`,
    html: shell({
      preheader: `I will reply within ${site.replyWithin}.`,
      title: 'Message received',
      body,
      footer: `${escapeHtml(site.ownerName)} &middot; <a href="${escapeHtml(site.siteUrl)}" style="color:${COLOR.faint};">${escapeHtml(site.siteUrl)}</a><br>You are receiving this because you sent a message through the contact form.`,
    }),
    text,
  }
}
