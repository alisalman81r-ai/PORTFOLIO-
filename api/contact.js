import { handleContact } from './_lib/core.js'

/**
 * POST /api/contact — Vercel serverless function.
 *
 * A THIN ADAPTER, ON PURPOSE
 * Everything this file does is translate between Vercel's `(req, res)` and the
 * plain objects `handleContact` takes and returns. That is the whole point: the
 * endpoint's logic has no framework in it, so moving to Next.js, Netlify,
 * Cloudflare Workers or Express is a new file of about this length and nothing
 * else changes.
 *
 * For reference, the Next.js App Router equivalent would be:
 *
 *     export async function POST(request) {
 *       const { status, body } = await handleContact({
 *         method: 'POST',
 *         headers: Object.fromEntries(request.headers),
 *         body: await request.json(),
 *       })
 *       return Response.json(body, { status })
 *     }
 *
 * WHY THERE IS NO NEXT.JS HERE
 * This project is Vite + React Router. Vercel serves the built static site and
 * runs anything in `/api` as a serverless function alongside it, which gives
 * real server-side routes without a framework migration. The brief asked for
 * Next.js API routes; adopting Next.js would mean rebuilding the application
 * shell, which the same brief ruled out.
 */
export default async function handler(req, res) {
  let body = req.body

  // Vercel parses JSON bodies for `content-type: application/json`, but not for
  // every content type and not in every runtime version. Parsing defensively
  // costs nothing and removes a class of "works locally, 400s in production".
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body)
    } catch {
      body = null
    }
  }

  const { status, body: payload } = await handleContact({
    method: req.method,
    headers: req.headers,
    body,
  })

  // No caching, ever. A cached 200 on a POST endpoint would mean a second
  // enquiry silently returning the first one's result.
  res.setHeader('Cache-Control', 'no-store')
  res.setHeader('Content-Type', 'application/json; charset=utf-8')

  if (status === 429 && payload.retryAfterSeconds) {
    res.setHeader('Retry-After', String(payload.retryAfterSeconds))
  }

  return res.status(status).json(payload)
}
