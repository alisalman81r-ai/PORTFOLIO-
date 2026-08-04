import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * Vite configuration.
 *
 * - `@` is aliased to `src` so imports stay flat and refactor-safe
 *   (`@/components/Button` instead of `../../../components/Button`).
 * - Tailwind v4 runs as a Vite plugin, so there is no PostCSS config to maintain.
 * - Animation libraries are split into their own vendor chunk: GSAP + Motion are
 *   heavy and stable, so caching them separately from app code pays off.
 *
 * @see https://vite.dev/config/
 */
export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
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
