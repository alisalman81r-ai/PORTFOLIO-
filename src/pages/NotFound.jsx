import { Link } from 'react-router-dom'

/**
 * 404 route. Deliberately unstyled beyond the layout primitives — the designed
 * version replaces this once the visual language exists.
 */
export default function NotFound() {
  return (
    <section className="container-page section-y">
      <h1 className="text-display-sm">404</h1>
      <p className="text-muted mt-4">This page does not exist.</p>
      <Link to="/" className="text-accent mt-8 inline-block underline underline-offset-4">
        Back home
      </Link>
    </section>
  )
}
