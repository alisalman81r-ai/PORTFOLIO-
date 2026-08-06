/**
 * Supabase storage adapter.
 *
 * WHY REST AND NOT `@supabase/supabase-js`
 * The client library is ~60 kB and brings a realtime websocket implementation,
 * auth helpers and a query builder. This endpoint inserts one row. PostgREST —
 * which is what the library talks to anyway — is a single authenticated POST,
 * so the adapter is thirty lines of `fetch` and the project gains no
 * dependency, no supply-chain surface and no cold-start weight.
 *
 * Swap this for the SDK the day the queries stop being one insert.
 *
 * THE KEY MUST BE THE SERVICE ROLE KEY, AND IT MUST NEVER REACH THE BROWSER
 * `SUPABASE_SERVICE_ROLE_KEY` bypasses row-level security, which is correct
 * here: the table is written by this endpoint and read by nobody else. It is
 * read from the environment inside a serverless function, so it is never in the
 * client bundle. Do not prefix it with `VITE_` — anything with that prefix is
 * inlined into the browser build by Vite, and this key in a browser is a
 * complete database compromise.
 */

/** Values sent to PostgREST, capped to match the column widths in schema.sql. */
const COLUMN_LIMITS = {
  name: 80,
  email: 160,
  company: 120,
  service: 40,
  budget: 40,
  timeline: 40,
  subject: 120,
  message: 2000,
  ip: 64,
  user_agent: 300,
}

const clamp = (value, limit) => String(value ?? '').slice(0, limit)

/**
 * @returns {import('./index').Store}
 */
export function createSupabaseStore() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  const table = process.env.SUPABASE_TABLE || 'contact_enquiries'

  const isConfigured = Boolean(url && key)

  return {
    name: 'supabase',
    isConfigured,

    async save(enquiry) {
      if (!isConfigured) return { id: null }

      const row = {
        name: clamp(enquiry.name, COLUMN_LIMITS.name),
        email: clamp(enquiry.email, COLUMN_LIMITS.email),
        company: clamp(enquiry.company, COLUMN_LIMITS.company) || null,
        service: clamp(enquiry.service, COLUMN_LIMITS.service),
        budget: clamp(enquiry.budget, COLUMN_LIMITS.budget) || null,
        timeline: clamp(enquiry.timeline, COLUMN_LIMITS.timeline) || null,
        subject: clamp(enquiry.subject, COLUMN_LIMITS.subject),
        message: clamp(enquiry.message, COLUMN_LIMITS.message),
        // `status` and `created_at` are column defaults — set in the schema
        // rather than here, so a row written by any other client is consistent.
        ip: clamp(enquiry.ip, COLUMN_LIMITS.ip) || null,
        user_agent: clamp(enquiry.userAgent, COLUMN_LIMITS.user_agent) || null,
      }

      const response = await fetch(`${url}/rest/v1/${encodeURIComponent(table)}`, {
        method: 'POST',
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
          // Ask for the inserted row back so the id can be logged and quoted in
          // the notification email — without it PostgREST returns 201 and no body.
          Prefer: 'return=representation',
        },
        body: JSON.stringify(row),
      })

      if (!response.ok) {
        const detail = await response.text().catch(() => '')
        throw new Error(`supabase insert failed (${response.status}): ${detail.slice(0, 300)}`)
      }

      const [inserted] = await response.json().catch(() => [])
      return { id: inserted?.id ?? null }
    },
  }
}
