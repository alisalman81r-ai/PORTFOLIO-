/**
 * CENTRALISED IMAGE REGISTRY
 * ==========================
 *
 * Every image in the app resolves through this file. No component and no other
 * data file references an image path directly — which is the whole point:
 * swapping a placeholder for a real asset is an edit *here*, and nothing else
 * changes.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * REPLACING A PLACEHOLDER WITH A REAL IMAGE
 * ─────────────────────────────────────────────────────────────────────────
 * 1. Drop the file into the matching folder under `src/assets/images/`.
 * 2. Import it at the top of this file.
 * 3. Swap the value below.
 *
 *    import portrait from '@/assets/images/profile/portrait.jpg'
 *    …
 *    profile: { avatar: portrait },
 *
 * Import rather than writing a string path. Vite then fingerprints the file,
 * compresses it, and emits a hashed immutable URL — and a typo fails the
 * *build* instead of shipping a broken `<img>` to production. A string path
 * gets none of that.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * WHY THE PLACEHOLDERS ARE REMOTE, AND WHY THAT IS TEMPORARY
 * ─────────────────────────────────────────────────────────────────────────
 * The defaults point at Unsplash's CDN. Every URL below was checked to return
 * 200 before being committed — none of them are guesses. That gets a realistic
 * portfolio on screen today without committing megabytes of stock photography
 * to the repository.
 *
 * It is explicitly a staging state, not a destination. Remote images mean:
 *   - a third-party dependency on every page load, and nothing renders offline
 *   - visitor IPs disclosed to another host
 *   - no Vite optimisation, no fingerprinting, no cache-busting control
 *   - a Content-Security-Policy that has to allow an external image host
 *
 * Replace them before launch. The structure below is designed so that is a
 * find-and-replace in one file.
 */

const UNSPLASH_BASE = 'https://images.unsplash.com/photo-'

/**
 * Build an Unsplash CDN URL.
 *
 * `auto=format` serves AVIF or WebP to browsers that accept them, `fit=crop`
 * honours the requested aspect, and `w`/`q` cap the transfer — a 4000px
 * original behind a 640px card is the single most common performance mistake
 * with stock imagery.
 *
 * @param {string} id Unsplash photo id (the part after `photo-`).
 * @param {object} [options]
 * @param {number} [options.w=1600] Delivered width in pixels.
 * @param {number} [options.h] Delivered height. Omit to keep the source aspect.
 * @param {number} [options.q=75] Quality. Above ~80 the bytes climb with no
 *   visible gain at these sizes.
 * @returns {string}
 */
function unsplash(id, { w = 1600, h, q = 75 } = {}) {
  const params = new URLSearchParams({
    auto: 'format',
    fit: 'crop',
    w: String(w),
    q: String(q),
  })
  if (h) params.set('h', String(h))

  return `${UNSPLASH_BASE}${id}?${params.toString()}`
}

/**
 * Sizes tuned to where each image is actually rendered, so nothing downloads
 * a 1600px file for a 96px slot.
 */
const SIZE = {
  /** About portrait — max ~448px wide, 4:5. Doubled for high-DPI screens. */
  portrait: { w: 900, h: 1125, q: 78 },
  /** Project preview — up to ~840px wide in the showcase row, 16:9. */
  cover: { w: 1400, h: 788, q: 75 },
  /** Modal gallery — two-up, so roughly half the cover width. */
  gallery: { w: 900, h: 506, q: 72 },
  /** Blog card — three-up grid, 16:9. */
  post: { w: 800, h: 450, q: 72 },
  /** Testimonial avatar — rendered at 48px. */
  avatar: { w: 128, h: 128, q: 70 },
}

/**
 * @typedef {object} MediaRegistry
 * @property {{avatar: string}} profile
 * @property {Record<string, {thumbnail: string, gallery: string[]}>} projects
 *   Keyed by project id from `projects.js`.
 * @property {Record<string, string>} blog Keyed by post id from `blog.js`.
 * @property {Record<string, string>} testimonials Keyed by testimonial id.
 */

/** @type {MediaRegistry} */
export const MEDIA = {
  /**
   * PLACEHOLDER — a workspace shot rather than a stock portrait.
   *
   * Deliberate: a photograph of a stranger standing in for you is worse than
   * an obvious placeholder, because it looks finished and is not. A desk reads
   * as "developer" without pretending to be a specific person.
   *
   * Replace with a real portrait. It is the single highest-value image on the
   * site — visitors decide whether to keep reading partly on it.
   */
  profile: {
    avatar: unsplash('1487017159836-4e23ece2e4cf', SIZE.portrait),
  },

  /**
   * Keyed by project id. A project with no entry renders `ImageFrame`'s
   * designed placeholder, so adding a project before its screenshots exist is
   * safe.
   *
   * These are mood-appropriate stock, not screenshots of the work. Real
   * screenshots are the most convincing thing on a portfolio — replace these
   * first.
   */
  projects: {
    'construction-website': {
      thumbnail: unsplash('1541888946425-d81bb19240f5', SIZE.cover),
      gallery: [
        unsplash('1541888946425-d81bb19240f5', SIZE.gallery),
        unsplash('1503387762-592deb58ef4e', SIZE.gallery),
      ],
    },
    'klyra-storyboard': {
      thumbnail: unsplash('1618788372246-79faff0c3742', SIZE.cover),
      gallery: [
        unsplash('1618788372246-79faff0c3742', SIZE.gallery),
        unsplash('1626785774573-4b799315345d', SIZE.gallery),
      ],
    },
    dashboard: {
      thumbnail: unsplash('1460925895917-afdab827c52f', SIZE.cover),
      gallery: [
        unsplash('1460925895917-afdab827c52f', SIZE.gallery),
        unsplash('1551288049-bebda4e38f71', SIZE.gallery),
      ],
    },
    exmo: {
      thumbnail: unsplash('1518770660439-4636190af475', SIZE.cover),
      gallery: [
        unsplash('1518770660439-4636190af475', SIZE.gallery),
        unsplash('1620712943543-bcc4688e7485', SIZE.gallery),
      ],
    },
  },

  /** Keyed by post id from `blog.js`. */
  blog: {
    'motion-with-purpose': unsplash('1517180102446-f3ece451e9d8', SIZE.post),
    'design-tokens': unsplash('1626785774573-4b799315345d', SIZE.post),
    'performance-budget': unsplash('1451187580459-43490279c0fa', SIZE.post),
    'accessible-by-default': unsplash('1522071820081-009f0129c71c', SIZE.post),
  },

  /**
   * Keyed by testimonial id.
   *
   * ⚠️ These are photographs of real people who did not write these quotes. They
   * are only safe because the names beside them are visibly unfilled — `Client
   * Name`, `Role`, `Company`. Fill in a real name beside a stock face and the
   * page is publishing a fabricated endorsement attributed to someone who never
   * gave it. Replace the name and the photograph together, or delete the entry.
   */
  testimonials: {
    'placeholder-1': unsplash('1507003211169-0a1dd7228f2d', SIZE.avatar),
    'placeholder-2': unsplash('1494790108377-be9c29b29330', SIZE.avatar),
    'placeholder-3': unsplash('1500648767791-00dcc994a43e', SIZE.avatar),
    'placeholder-4': unsplash('1438761681033-6461ffad8d80', SIZE.avatar),
  },
}

/**
 * Resolve a project's media, falling back to a shape the components can render.
 *
 * Returning a valid object rather than `undefined` means a project added
 * without a registry entry degrades to the designed placeholder instead of
 * throwing on `.gallery.length`.
 *
 * @param {string} projectId
 * @returns {{thumbnail: string|null, gallery: string[]}}
 */
export function getProjectMedia(projectId) {
  return MEDIA.projects[projectId] ?? { thumbnail: null, gallery: [] }
}
