/**
 * Site-level metadata.
 *
 * Everything a page needs to describe itself to a browser, a crawler, or a
 * social-media unfurl. Kept apart from `personal.js` because this describes the
 * *website*, while that describes the *person*.
 *
 * Single source of truth for `<title>`, meta description, Open Graph, and
 * canonical URLs once an SEO component exists.
 */

export const SITE = {
  /** Short name — browser tab, PWA manifest. */
  name: 'Portfolio',

  /** Default `<title>`. Kept under ~60 chars so search results don't truncate. */
  title: 'Portfolio',

  /**
   * Template applied to inner pages. `%s` is replaced with the page title.
   * @example 'Case Study — Portfolio'
   */
  titleTemplate: '%s — Portfolio',

  /** Default meta description. ~150–160 chars is the display limit. */
  description: 'Personal portfolio.',

  /** Absolute production URL, no trailing slash. Used for canonical + OG tags. */
  url: 'https://example.com',

  /** Social share image — 1200×630. Place in `/public`, reference absolutely. */
  ogImage: '/og-image.jpg',

  /** BCP 47 language tag. Must match the `lang` attribute in index.html. */
  locale: 'en',

  /** Fallback theme when a visitor has no stored preference. */
  defaultTheme: 'dark',
}
