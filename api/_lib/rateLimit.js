/**
 * Rate limiting.
 *
 * READ THIS BEFORE TRUSTING IT
 * The default backing store is a Map in the function's memory, and serverless
 * functions do not have shared memory. Each warm instance keeps its own
 * counter, and a cold start begins with none. That means the in-memory limiter
 * is *real but partial*: it reliably stops the common case — one script
 * hammering one endpoint, which lands on the same warm instance — and it does
 * not stop a distributed flood.
 *
 * It is the default anyway, because the alternative is either a hard dependency
 * on a KV service before the form has ever been used, or no limiting at all.
 * Partial protection that costs nothing beats perfect protection that never
 * gets configured.
 *
 * MOVING TO A REAL SHARED STORE
 * Set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` and this switches
 * to Upstash automatically — same interface, no code change. Do that before the
 * contact form is publicly linked anywhere that attracts attention.
 *
 * WHAT COUNTS AS AN IDENTITY
 * The client IP, read from `x-forwarded-for`. It is spoofable in general, but
 * not behind Vercel's proxy, which overwrites it with the real connecting
 * address. On another host, check that the header is trustworthy before relying
 * on it.
 */

/** Requests allowed per window, per identity. */
const MAX_REQUESTS = Number(process.env.RATE_LIMIT_MAX ?? 5)

/** Window length in milliseconds. */
const WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS ?? 10 * 60 * 1000)

/**
 * In-memory hit counter.
 *
 * Module scope, so it survives between invocations on a warm instance — which
 * is the entire mechanism. It is bounded by the sweep in `prune` so a long-lived
 * instance under attack cannot grow it without limit.
 *
 * @type {Map<string, {count: number, resetAt: number}>}
 */
const hits = new Map()

/** Drop expired entries. Cheap, and it keeps the map from growing forever. */
function prune(now) {
  if (hits.size < 1000) return
  for (const [key, entry] of hits) {
    if (entry.resetAt <= now) hits.delete(key)
  }
}

/**
 * Identify the caller.
 *
 * `x-forwarded-for` is a list when proxies chain; the first entry is the
 * original client. Falls back to a constant, which makes the limiter global
 * rather than per-IP when no header is present — the safe direction to fail.
 *
 * @param {Record<string, string|string[]|undefined>} headers
 * @returns {string}
 */
export function clientIdentity(headers = {}) {
  const forwarded = headers['x-forwarded-for'] ?? headers['X-Forwarded-For']
  const raw = Array.isArray(forwarded) ? forwarded[0] : forwarded
  const first = String(raw ?? '').split(',')[0].trim()
  return first || String(headers['x-real-ip'] ?? '') || 'unknown'
}

/**
 * Upstash Redis, when configured.
 *
 * Uses a fixed window via INCR + EXPIRE, which is not as smooth as a sliding
 * window but is two round trips and cannot drift. Any failure here returns
 * `null`, and the caller falls back to the in-memory limiter rather than
 * failing the request — a rate limiter that takes the endpoint down when its
 * backing store hiccups is worse than the abuse it prevents.
 *
 * @param {string} key
 * @returns {Promise<{allowed: boolean, remaining: number, resetMs: number}|null>}
 */
async function upstashCheck(key) {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null

  try {
    const headers = { Authorization: `Bearer ${token}` }
    const seconds = Math.ceil(WINDOW_MS / 1000)

    const incr = await fetch(`${url}/incr/${encodeURIComponent(key)}`, { headers })
    if (!incr.ok) return null
    const { result: count } = await incr.json()

    // Only set the expiry on the first hit of a window; doing it every time
    // would slide the window forward and never let the counter reset.
    if (count === 1) {
      await fetch(`${url}/expire/${encodeURIComponent(key)}/${seconds}`, { headers })
    }

    return {
      allowed: count <= MAX_REQUESTS,
      remaining: Math.max(0, MAX_REQUESTS - count),
      resetMs: WINDOW_MS,
    }
  } catch {
    return null
  }
}

/**
 * Check and consume one unit of quota.
 *
 * @param {string} identity
 * @param {string} [scope] Distinguishes limits on different endpoints.
 * @returns {Promise<{allowed: boolean, remaining: number, resetMs: number, backend: string}>}
 */
export async function rateLimit(identity, scope = 'contact') {
  const key = `ratelimit:${scope}:${identity}`

  const shared = await upstashCheck(key)
  if (shared) return { ...shared, backend: 'upstash' }

  const now = Date.now()
  prune(now)

  const entry = hits.get(key)

  if (!entry || entry.resetAt <= now) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return { allowed: true, remaining: MAX_REQUESTS - 1, resetMs: WINDOW_MS, backend: 'memory' }
  }

  entry.count += 1

  return {
    allowed: entry.count <= MAX_REQUESTS,
    remaining: Math.max(0, MAX_REQUESTS - entry.count),
    resetMs: Math.max(0, entry.resetAt - now),
    backend: 'memory',
  }
}

/** Test seam — resets the in-memory store between cases. */
export function __resetRateLimit() {
  hits.clear()
}
