/**
 * The store used when no database is configured.
 *
 * Accepts every enquiry and stores nothing. This is what lets the contact form
 * work the moment `RESEND_API_KEY` is set, without also requiring a database to
 * exist — the enquiry still reaches a human by email, which is the part that
 * actually matters.
 *
 * It logs a single line per enquiry so the absence of storage is visible in the
 * function logs rather than silent. Not the content of the message: that is
 * personal data and log retention is not the place for it.
 */
export function createNoopStore() {
  return {
    name: 'none',
    isConfigured: false,

    async save() {
      console.info(
        '[contact] no database configured — enquiry sent by email only. ' +
          'Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to persist enquiries.',
      )
      return { id: null }
    },
  }
}
