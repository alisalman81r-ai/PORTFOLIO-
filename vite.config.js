import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import { SEO, buildMetaTags, buildStructuredData } from './src/data/seo.js'

/** Escape a value for safe interpolation into an HTML attribute. */
const escapeAttr = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

/**
 * Writes SEO metadata into the built HTML, and emits `robots.txt` and
 * `sitemap.xml`.
 *
 * WHY THIS IS A BUILD STEP AND NOT A REACT COMPONENT
 * Social unfurlers — Twitter, LinkedIn, Slack, Discord, iMessage — do not
 * execute JavaScript. They fetch the HTML, read the `og:` tags and leave. Tags
 * rendered by React are invisible to every one of them, so a React-only
 * implementation yields link previews with no title, description or image.
 *
 * Generating from `src/data/seo.js` rather than hand-writing the tags into
 * `index.html` means the static head, the runtime component, the sitemap and
 * the robots file all read the same values and cannot drift apart.
 */
function seoPlugin() {
  return {
    name: 'portfolio-seo',
    apply: 'build',

    transformIndexHtml(html) {
      const tags = buildMetaTags()
        .map((tag) => {
          const key = tag.property ? 'property' : 'name'
          return `    <meta ${key}="${escapeAttr(tag.property ?? tag.name)}" content="${escapeAttr(tag.content)}" />`
        })
        .join('\n')

      // `</script>` inside JSON would close the tag early; the escape is what
      // makes inlining JSON-LD safe.
      const jsonLd = JSON.stringify(buildStructuredData()).replace(/</g, '\\u003c')

      return (
        html
          // Replace the dev fallback, so the built title comes from the same
          // config as everything else rather than being typed twice.
          .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeAttr(SEO.title)}</title>`)
          .replace(
            '</head>',
            `${tags}\n    <link rel="canonical" href="${escapeAttr(SEO.url)}" />\n` +
              `    <script type="application/ld+json">${jsonLd}</script>\n  </head>`,
          )
      )
    },

    generateBundle() {
      // `noindex` while the content is placeholder — the robots file has to
      // agree with the meta tag, or the two send crawlers opposite signals.
      const robots = SEO.indexable
        ? `User-agent: *\nAllow: /\n\nSitemap: ${SEO.url}sitemap.xml\n`
        : `# Placeholder content — not for indexing yet.\n# Flip SEO.indexable in src/data/seo.js when the real content lands.\nUser-agent: *\nDisallow: /\n`

      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robots })

      // A single-page site has one URL. Anchors are not separate documents and
      // listing them would be padding a sitemap with fragments crawlers ignore.
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source:
          `<?xml version="1.0" encoding="UTF-8"?>\n` +
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
          `  <url>\n    <loc>${SEO.url}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>1.0</priority>\n  </url>\n` +
          `</urlset>\n`,
      })
    },
  }
}

/**
 * Vite configuration.
 *
 * - `@` is aliased to `src` so imports stay flat and refactor-safe
 *   (`@/components/Button` instead of `../../../components/Button`).
 * - Tailwind v4 runs as a Vite plugin, so there is no PostCSS config to maintain.
 * - Animation libraries are split into their own vendor chunk: GSAP + Motion are
 *   heavy and stable, so caching them separately from app code pays off.
 * - `seoPlugin` bakes crawler-critical metadata into the HTML at build.
 *
 * @see https://vite.dev/config/
 */
export default defineConfig({
  plugins: [react(), tailwindcss(), seoPlugin()],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // The contact form's validation rules are shared with the serverless
      // function in /api, which cannot resolve '@'. They live in /shared and
      // are imported by both — see shared/contactSchema.js.
      '@shared': fileURLToPath(new URL('./shared', import.meta.url)),
    },
  },

  server: {
    port: 3000,
    // Deliberately not auto-opening a browser. `open: true` launches the OS
    // default (Edge on Windows), which is rarely the browser you develop in.
    // Set it to `true` — or to a browser name, e.g. 'chrome' — if you want it.
    open: false,
  },

  preview: {
    port: 3000,
  },

  build: {
    target: 'es2022',
    cssMinify: 'lightningcss',
    sourcemap: false,
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        // Vite 8 bundles with Rolldown, whose chunking API is `codeSplitting`
        // (Rollup's object-form `manualChunks` is not supported, and
        // `advancedChunks` is already deprecated).
        codeSplitting: {
          groups: [
            {
              name: 'react',
              test: /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/,
            },
            {
              // `motion` re-exports from `framer-motion` internally, so the
              // real implementation lives under that directory name — matching
              // only `motion` leaves AnimatePresence in the app chunk.
              name: 'animation',
              test: /[\\/]node_modules[\\/](gsap|@gsap[\\/]react|motion|framer-motion|motion-dom|motion-utils|lenis)[\\/]/,
            },
            {
              // Small, stable, and imported by nearly every component. Split so
              // that shipping a component change never re-downloads them.
              name: 'utils',
              test: /[\\/]node_modules[\\/](clsx|tailwind-merge)[\\/]/,
            },
          ],
        },
      },
    },
  },
})
