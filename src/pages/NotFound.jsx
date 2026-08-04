import { Link } from 'react-router-dom'

import { Section } from '@/layouts'

/**
 * 404 route.
 *
 * Deliberately minimal — built only from layout primitives and design-system
 * classes, with no bespoke styling. It doubles as the smallest possible worked
 * example of the architecture: `<Section>` for rhythm and width, `heading-*`
 * and `btn` for type and controls, semantic colour tokens throughout.
 *
 * Replace with a designed version once the visual language exists.
 */
export default function NotFound() {
  return (
    <Section labelledBy="not-found-title" className="min-h-[70vh] grid place-items-center">
      <div className="text-center">
        <p className="eyebrow">Error 404</p>

        <h1 id="not-found-title" className="heading-lg mt-4">
          Page not found
        </h1>

        <p className="lead mx-auto mt-4 max-w-prose">
          The page you are looking for does not exist or has moved.
        </p>

        <Link to="/" className="btn btn-primary mt-8">
          Back to home
        </Link>
      </div>
    </Section>
  )
}
