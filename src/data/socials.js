/**
 * Social and professional profiles.
 *
 * ICONS ARE STORED AS STRINGS, NOT IMPORTS.
 *
 * Importing a React component into a data file would couple content to the
 * rendering layer: the data could no longer be serialised, sent over a network,
 * moved to a CMS, or used outside React. The consuming component maps the
 * `icon` key to a `lucide-react` (or `react-icons`) component instead.
 *
 * It also keeps the bundle honest — importing an icon per entry pulls every one
 * into the graph whether it renders or not.
 *
 * @example
 * import { Github, Linkedin, Mail } from 'lucide-react'
 * const ICONS = { github: Github, linkedin: Linkedin, email: Mail }
 * const Icon = ICONS[social.icon]
 */

/**
 * @typedef {object} SocialLink
 * @property {string} id     Stable key for React lists.
 * @property {string} label  Accessible name — announced by screen readers.
 * @property {string} href   Full URL, or a `mailto:` address.
 * @property {string} icon   Lookup key resolved by the consuming component.
 * @property {string} [handle] Display text (`@username`) where the URL is ugly.
 * @property {boolean} [primary] Featured in the hero/contact block, not just the footer.
 */

/**
 * PLACEHOLDER — replace each `href` with a real profile.
 *
 * Left as example.com rather than invented usernames: a plausible-looking but
 * wrong handle is worse than an obviously empty one, because it can ship
 * unnoticed and point visitors at someone else's account.
 *
 * @type {SocialLink[]}
 */
export const SOCIAL_LINKS = [
  {
    id: 'github',
    label: 'GitHub',
    href: 'https://example.com',
    icon: 'github',
    handle: '@username',
    primary: true,
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    href: 'https://example.com',
    icon: 'linkedin',
    handle: '/in/username',
    primary: true,
  },
  {
    id: 'x',
    label: 'X',
    href: 'https://example.com',
    icon: 'twitter',
    handle: '@username',
  },
  {
    id: 'dribbble',
    label: 'Dribbble',
    href: 'https://example.com',
    icon: 'dribbble',
    handle: '@username',
  },
]
