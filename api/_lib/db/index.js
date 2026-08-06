import { createSupabaseStore } from './supabase.js'
import { createNoopStore } from './noop.js'

/**
 * Storage — one interface, swappable backends.
 *
 * THE INTERFACE IS THE POINT
 * The brief asked for a database that another database can replace later, and
 * the only way to actually get that is to keep every backend behind a contract
 * narrow enough that a new one is a single file. This is that contract:
 *
 *     createStore() -> { name, isConfigured, save(enquiry) -> { id } }
 *
 * `save` takes an already-validated, already-normalised enquiry and returns the
 * stored id. It does not know about HTTP, email, or the shape of the form. A
 * Postgres, Mongo, Airtable or Notion backend is a file exporting the same
 * three things — nothing in `core.js` changes.
 *
 * FAILING TO STORE MUST NOT FAIL THE ENQUIRY
 * This is the important decision in this module. If the database is down and
 * the email sends, the enquiry reached a human and the submission succeeded.
 * Telling the visitor it failed would make them send it again — or give up —
 * over a problem that did not affect them. So `core.js` treats a storage error
 * as loggable, not fatal, and the store never throws for a reason the visitor
 * could not act on.
 *
 * NO BACKEND CONFIGURED IS A VALID STATE
 * Before Supabase exists, `createNoopStore` accepts and discards, and the form
 * works end to end on email alone. The alternative — refusing to run without a
 * database — makes the form unusable on day one for no benefit.
 */

/**
 * @typedef {object} Enquiry
 * @property {string} name
 * @property {string} email
 * @property {string} company
 * @property {string} service
 * @property {string} budget
 * @property {string} timeline
 * @property {string} subject
 * @property {string} message
 * @property {string} [ip]
 * @property {string} [userAgent]
 */

/**
 * @typedef {object} Store
 * @property {string} name
 * @property {boolean} isConfigured
 * @property {(enquiry: Enquiry) => Promise<{id: string|null}>} save
 */

/**
 * Pick a backend from the environment.
 *
 * Ordered by preference; the first configured one wins. Add a backend by
 * importing its factory and putting it in this list.
 *
 * @returns {Store}
 */
export function createStore() {
  const candidates = [createSupabaseStore()]
  return candidates.find((store) => store.isConfigured) ?? createNoopStore()
}
