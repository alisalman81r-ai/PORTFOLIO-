import { useEffect } from 'react'

import { SEO } from '@/data/seo'

/**
 * Create-or-update a single `<meta>` tag by name.
 *
 * Upsert rather than append — which is the whole reason this is imperative. See
 * the note in `Seo` below.
 *
 * @param {string} name
 * @param {string} content
 */
function upsertMeta(name, content) {
  let tag = document.head.querySelector(`meta[name="${name}"]`)

  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute('name', name)
    document.head.appendChild(tag)
  }

  const previous = tag.getAttribute('content')
  tag.setAttribute('content', content)
  return previous
}

/**
 * Per-route document metadata.
 *
 * WHAT THIS IS *NOT* FOR
 * Social previews. Twitter, LinkedIn, Slack and friends never run JavaScript,
 * so anything set here is invisible to them — those tags are baked into the
 * HTML at build by `seoPlugin` in `vite.config.js`, from the same config this
 * reads.
 *
 * WHAT IT IS FOR
 * A single-page app changes route without a document reload, so the `<title>`
 * baked in at build would otherwise describe the home page forever. This keeps
 * it accurate as the visitor navigates, which matters for browser history,
 * bookmarks, tab labels, and screen readers — all of which announce the title
 * on navigation.
 *
 * WHY EFFECTS AND NOT REACT 19's NATIVE `<title>` HOISTING
 * The declarative form is tidier and was tried first. React 19 hoists a
 * rendered `<title>` or `<meta>` into `<head>` by *appending* it — it does not
 * reconcile against tags already present in the served HTML. Because this
 * project injects those same tags at build time, the result was measurably two
 * `<title>` elements and two conflicting `<meta name="robots">` tags in the
 * live document.
 *
 * Writing to `document.title` and upserting the meta tag is deterministic:
 * exactly one of each exists, no matter how many times a route mounts, and the
 * previous value is restored on unmount so a route cannot leak its title into
 * the next one.
 *
 * @param {object} props
 * @param {string} [props.title] Page title. Runs through `SEO.titleTemplate`;
 *   omit for the site default.
 * @param {string} [props.description] Overrides the default description.
 * @param {boolean} [props.noindex] Keeps a route out of search results — for a
 *   404, or anything not meant to be a landing page.
 */
export function Seo({ title, description, noindex }) {
  const documentTitle = title ? SEO.titleTemplate.replace('%s', title) : SEO.title

  useEffect(() => {
    const previousTitle = document.title
    document.title = documentTitle

    return () => {
      document.title = previousTitle
    }
  }, [documentTitle])

  useEffect(() => {
    if (!description) return

    const previous = upsertMeta('description', description)
    return () => {
      if (previous !== null) upsertMeta('description', previous)
    }
  }, [description])

  useEffect(() => {
    // The build already emits a site-wide directive; this only narrows it for a
    // single route, and only while that route is mounted.
    if (!noindex || !SEO.indexable) return

    const previous = upsertMeta('robots', 'noindex, nofollow')
    return () => {
      if (previous !== null) upsertMeta('robots', previous)
    }
  }, [noindex])

  return null
}
