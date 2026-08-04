import { Component } from 'react'

/**
 * Top-level error boundary.
 *
 * Class-based because React still offers no hook equivalent for
 * `componentDidCatch`. Its only job is to keep a render error in one animated
 * section from blanking the entire page.
 *
 * Note that this catches *render* errors only — not errors thrown in event
 * handlers, async callbacks, or rAF loops.
 *
 * @example
 * <ErrorBoundary fallback={<SomethingWentWrong />}>
 *   <App />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    // Replace with a real reporter (Sentry, LogRocket) when one is added.
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  render() {
    const { error } = this.state
    const { children, fallback } = this.props

    if (!error) return children
    if (fallback) return fallback

    return (
      <div role="alert" className="container-page section-y">
        <p className="text-muted">Something went wrong.</p>
      </div>
    )
  }
}
