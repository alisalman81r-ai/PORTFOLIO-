import { SEO } from '@/data/seo'

/**
 * Per-route document metadata.
 *
 * WHAT THIS IS *NOT* FOR
 * Social previews. Twitter, LinkedIn, Slack and friends never run JavaScript,
 * so anything React renders is invisible to them — those tags are baked into
 * the HTML at build by `seoPlugin` in `vite.config.js`, from the same config
 * this reads.
 *
 * WHAT IT IS FOR
 * A single-page app changes route without a document reload, so the `<title>`
 * baked in at build would otherwise describe the home page forever. This keeps
 * it accurate as the visitor navigates — which matters for browser history,
 * bookmarks, tab labels and screen readers, all of which announce the title on
 * navigation.
 *
 * Uses React 19's native metadata hoisting: a `<title>` or `<meta>` rendered
 * anywhere in the tree is moved into `<head>` automatically. No Helmet, no
 * portal, no extra dependency.
 *
 * @param {object} props
 * @param {string} [props.title] Page title. Runs through `SEO.titleTemplate`;
 *   omit for the site default.
 * @param {string} [props.description] Overrides the default description.
 * @param {boolean} [props.noindex] Keeps a route out of search results —
 *   for a 404, or anything not meant to be a landing page.
 */
export function Seo({ title, description, noindex }) {
  const documentTitle = title ? SEO.titleTemplate.replace('%s', title) : SEO.title

  return (
    <>
      <title>{documentTitle}</title>
      {description && <meta name="description" content={description} />}
      {(noindex || !SEO.indexable) && <meta name="robots" content="noindex, nofollow" />}
    </>
  )
}
