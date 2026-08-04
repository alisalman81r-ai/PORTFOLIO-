/**
 * Site-wide content and configuration.
 *
 * Content lives as data, not as JSX. Copy changes should never require touching
 * a component, and this is what a CMS would eventually replace.
 */

export const SITE = {
  name: 'Portfolio',
  title: 'Portfolio',
  description: 'Personal portfolio.',
  url: 'https://example.com',
  locale: 'en',
  author: {
    name: '',
    role: '',
    email: '',
    location: '',
  },
}

/**
 * Primary navigation. `path` values must match the route definitions in
 * `src/App.jsx`.
 */
export const NAV_LINKS = [
  { label: 'Home', path: '/' },
]

/**
 * External profiles. `icon` is a key resolved by the consuming component
 * against `lucide-react` or `react-icons`, so this file stays free of imports.
 */
export const SOCIAL_LINKS = [
  // { label: 'GitHub', href: 'https://github.com/…', icon: 'github' },
]
