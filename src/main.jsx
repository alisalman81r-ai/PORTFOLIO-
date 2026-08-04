import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import '@/styles/index.css'

import { App } from './App'
import { AppProviders } from '@/context/AppProviders'
import { ErrorBoundary } from '@/components'

/**
 * Application entry point.
 *
 * Composition order is deliberate:
 *
 *   StrictMode    — surfaces unsafe effects and double-invokes them in dev,
 *                   which is exactly what catches un-disposed GSAP timelines
 *                   and Lenis instances.
 *   ErrorBoundary — outermost React boundary, so a crash inside any provider
 *                   is still caught.
 *   AppProviders  — theme + global motion configuration.
 *   App           — router.
 */
const container = document.getElementById('root')

if (!container) {
  throw new Error('Root element #root was not found in index.html.')
}

createRoot(container).render(
  <StrictMode>
    <ErrorBoundary>
      <AppProviders>
        <App />
      </AppProviders>
    </ErrorBoundary>
  </StrictMode>,
)
