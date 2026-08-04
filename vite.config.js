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
    open: true,
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
              test: /[\\/]node_modules[\\/](react|react-dom|react-router|scheduler)[\\/]/,
            },
            {
              name: 'animation',
              test: /[\\/]node_modules[\\/](gsap|@gsap[\\/]react|motion|motion-dom|motion-utils|lenis)[\\/]/,
            },
          ],
        },
      },
    },
  },
})
