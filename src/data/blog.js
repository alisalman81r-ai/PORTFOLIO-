/**
 * Blog / insights.
 *
 * PLACEHOLDER ARTICLES. The four entries below are subjects worth writing
 * about rather than pieces that exist — every `url` is empty, so the card
 * renders its action as disabled rather than linking somewhere dead. Fill in a
 * `url` (an external post, or a future `/blog/:slug` route) and the button
 * activates itself.
 *
 * COVER IMAGES
 * Leave `cover` as `null` until real artwork exists — `ImageFrame` renders a
 * designed placeholder instead of a broken image. When you have one, IMPORT it
 * rather than writing a string path, so Vite fingerprints it and a typo fails
 * the build instead of shipping a broken `<img>`:
 *
 *   import coverMotion from '@/assets/images/blog-motion.jpg'
 *   …
 *   cover: coverMotion,
 */

export const BLOG_META = {
  badge: 'Insights',
  headline: [{ text: 'Notes on' }, { text: 'building things', accent: true }],
  intro:
    'Occasional writing about the decisions behind the work — the trade-offs, the things that did not work, and what I would do differently.',
}

/**
 * @typedef {object} Post
 * @property {string} id
 * @property {string} slug          URL segment for a future `/blog/:slug` route.
 * @property {string} category      One label, not a tag cloud.
 * @property {string} title
 * @property {string} description   Two sentences. The card is a preview, not the piece.
 * @property {string} date          ISO 'YYYY-MM-DD'. Stored machine-readable so it
 *   sorts and localises; formatted at render by `formatDate()` from `@/utils`.
 * @property {number} readingTime   Minutes. Set it honestly — an inflated figure
 *   is the fastest way to lose a reader at the halfway mark.
 * @property {string|null} cover
 * @property {string} url           External link, or a route. Empty renders the
 *   action disabled rather than linking nowhere.
 * @property {boolean} [featured]   Surfaced in the preview grid on the home page.
 */

/** @type {Post[]} */
export const POSTS = [
  {
    id: 'motion-with-purpose',
    slug: 'motion-with-purpose',
    category: 'Motion',
    title: 'Animation that earns its place',
    description:
      'Most web animation is decoration wearing the costume of craft. A look at when motion actually helps a user, and the point at which it starts costing them.',
    date: '2025-11-18',
    readingTime: 6,
    cover: null,
    url: '',
    featured: true,
  },
  {
    id: 'design-tokens',
    slug: 'design-tokens-that-survive',
    category: 'Design Systems',
    title: 'Design tokens that survive contact with a codebase',
    description:
      'Why a three-layer token system beats a flat list of colours, and how naming things for their role rather than their value makes a redesign a one-file change.',
    date: '2025-10-02',
    readingTime: 8,
    cover: null,
    url: '',
    featured: true,
  },
  {
    id: 'performance-budget',
    slug: 'performance-as-a-feature',
    category: 'Performance',
    title: 'Treating performance as a feature, not a cleanup task',
    description:
      'A budget agreed at the start is worth more than an audit at the end. How to decide what a page is allowed to cost before anyone writes the first component.',
    date: '2025-08-27',
    readingTime: 7,
    cover: null,
    url: '',
    featured: true,
  },
  {
    id: 'accessible-by-default',
    slug: 'accessible-by-default',
    category: 'Accessibility',
    title: 'The accessibility work that costs nothing',
    description:
      'Semantic elements, real labels, and a visible focus ring get you most of the way. A practical list of the things that are free if you do them first.',
    date: '2025-07-09',
    readingTime: 5,
    cover: null,
    url: '',
    featured: false,
  },
]

/**
 * Newest first.
 *
 * Sorts a *copy* — `Array.prototype.sort` mutates in place, and reordering the
 * exported array would corrupt it for every other importer.
 *
 * @type {Post[]}
 */
export const POSTS_SORTED = [...POSTS].sort((a, b) => b.date.localeCompare(a.date))

/**
 * The three shown on the home page.
 *
 * Capped deliberately: this is a preview, and a section that lists everything
 * removes the reason to visit the blog itself.
 *
 * @type {Post[]}
 */
export const FEATURED_POSTS = POSTS_SORTED.filter((post) => post.featured).slice(0, 3)

/**
 * Whether to render the section at all.
 *
 * One article is not a blog. Below the threshold the section is skipped rather
 * than shown looking empty.
 *
 * @type {boolean}
 */
export const HAS_POSTS = FEATURED_POSTS.length >= 2

/**
 * Look up a post — for a future `/blog/:slug` route.
 *
 * @param {string} slug
 * @returns {Post|undefined} Undefined for an unknown slug; the route should
 *   render a 404 rather than an empty page.
 */
export function getPostBySlug(slug) {
  return POSTS.find((post) => post.slug === slug)
}
