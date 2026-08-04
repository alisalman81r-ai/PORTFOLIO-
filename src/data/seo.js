import { PERSONAL } from './personal.js'
import { SITE } from './site.js'
import { SOCIAL_LINKS } from './socials.js'

/**
 * SEO configuration — one source of truth for every piece of metadata.
 *
 * THIS FILE IS READ TWICE, AND THE REASON MATTERS
 * ───────────────────────────────────────────────
 * 1. At BUILD time, by the plugin in `vite.config.js`, which writes the tags
 *    into `index.html` and emits `robots.txt` and `sitemap.xml`.
 * 2. At RUN time, by `components/shared/Seo.jsx`, for per-route titles.
 *
 * Both are necessary, and the split is not redundancy:
 *
 *   Social unfurlers — Twitter, Facebook, LinkedIn, Slack, Discord — do NOT
 *   execute JavaScript. They fetch the HTML, read the `og:` and `twitter:`
 *   tags, and leave. Metadata rendered by React is invisible to every one of
 *   them, so a React-only implementation produces a link preview with no title,
 *   no description and no image. That is why the crawler-critical tags are
 *   baked into the HTML at build.
 *
 *   Google does execute JavaScript, and a single-page app changes route without
 *   a document reload — so the runtime component is what keeps the title
 *   accurate as the visitor navigates.
 *
 * Because both read from here, they cannot drift apart.
 *
 * ⚠️ `SITE.url` is still `https://example.com`. Canonical URLs, the sitemap and
 * the absolute OG image path all derive from it, so set the real domain before
 * launch or every one of them points at the wrong host.
 */

/** Absolute URL for a path. OG and canonical tags reject relative URLs. */
const absolute = (pathname = '/') =>
  `${SITE.url.replace(/\/$/, '')}${pathname.startsWith('/') ? pathname : `/${pathname}`}`

export const SEO = {
  siteName: SITE.name,
  title: SITE.title,
  titleTemplate: SITE.titleTemplate,
  description: SITE.description,
  url: absolute('/'),
  locale: SITE.locale,

  /**
   * 1200×630 is the size every platform crops toward. Absolute, because
   * relative paths are silently dropped by most unfurlers.
   */
  image: absolute(SITE.ogImage),
  imageAlt: `${SITE.name} — portfolio of ${PERSONAL.role}`,

  /** Twitter's large-image card. `summary` renders a thumbnail nobody notices. */
  twitterCard: 'summary_large_image',

  /**
   * Keywords are ignored by every major engine and have been for over a decade.
   * Deliberately absent rather than forgotten.
   */

  /**
   * `noindex` while the content is placeholder.
   *
   * Shipping a portfolio full of `Your Name` and `Client Name` into the index
   * is worse than not being indexed at all — search engines cache it, and the
   * first impression a recruiter gets from a search result is copy you never
   * wrote. Flip this to `true` when the real content lands.
   */
  indexable: false,
}

/**
 * Structured data (JSON-LD).
 *
 * Two graphs: a `Person` describing you, and a `WebSite` describing this page.
 * Google uses them to build knowledge-panel entries and richer results, and
 * `sameAs` is how it connects this site to your other profiles — which is why
 * only real, resolving URLs belong in it.
 *
 * Placeholder social links are filtered out. A `sameAs` pointing at
 * `example.com` is a wrong claim about identity, and structured data is exactly
 * where a wrong claim is most costly.
 */
export function buildStructuredData() {
  const verifiedProfiles = SOCIAL_LINKS.filter(
    (social) => social.href && !social.href.includes('example.com'),
  ).map((social) => social.href)

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${SEO.url}#person`,
        name: PERSONAL.name,
        jobTitle: PERSONAL.role,
        description: PERSONAL.bioShort,
        url: SEO.url,
        ...(verifiedProfiles.length > 0 && { sameAs: verifiedProfiles }),
      },
      {
        '@type': 'WebSite',
        '@id': `${SEO.url}#website`,
        url: SEO.url,
        name: SEO.siteName,
        description: SEO.description,
        inLanguage: SEO.locale,
        publisher: { '@id': `${SEO.url}#person` },
      },
    ],
  }
}

/**
 * The tags that must exist in the HTML before any JavaScript runs.
 *
 * Returned as data rather than a string so the build plugin can serialise them
 * and escape the values in one place.
 *
 * @returns {{name?: string, property?: string, content: string}[]}
 */
export function buildMetaTags() {
  return [
    { name: 'description', content: SEO.description },
    {
      name: 'robots',
      content: SEO.indexable ? 'index, follow' : 'noindex, nofollow',
    },

    // Open Graph — Facebook, LinkedIn, Slack, Discord, iMessage.
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: SEO.siteName },
    { property: 'og:title', content: SEO.title },
    { property: 'og:description', content: SEO.description },
    { property: 'og:url', content: SEO.url },
    { property: 'og:image', content: SEO.image },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:image:alt', content: SEO.imageAlt },
    { property: 'og:locale', content: SEO.locale.replace('-', '_') },

    // Twitter/X.
    { name: 'twitter:card', content: SEO.twitterCard },
    { name: 'twitter:title', content: SEO.title },
    { name: 'twitter:description', content: SEO.description },
    { name: 'twitter:image', content: SEO.image },
    { name: 'twitter:image:alt', content: SEO.imageAlt },
  ]
}
