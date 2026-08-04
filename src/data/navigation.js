/**
 * Navigation structure.
 *
 * Header, mobile menu, and footer all read from here, so a link is added or
 * renamed in exactly one place and the three can never disagree.
 */

/**
 * @typedef {object} NavLink
 * @property {string} label Visible text.
 * @property {string} href  Route path (`/work`) or in-page anchor (`#work`).
 * @property {boolean} [external] Renders an <a> with rel="noreferrer" instead
 *   of a react-router <Link>.
 */

/**
 * Primary navigation.
 *
 * Anchors, not routes, because the portfolio is a single scrolling page. Each
 * `href` must match a `<Section id="…">`; `scroll-margin-block-start` in
 * `styles/base.css` keeps the target clear of the fixed header.
 *
 * Swap an entry to a route path (`/work`) once a section earns its own page —
 * nothing else needs to change.
 *
 * @type {NavLink[]}
 */
export const NAV_LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Contact', href: '#contact' },
]

/**
 * Footer links. Usually a superset of the primary nav plus legal pages.
 * @type {NavLink[]}
 */
export const FOOTER_LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

/**
 * Section ids in scroll order.
 *
 * Lets scroll-spy highlight the active nav item without hardcoding the order
 * in the header component.
 *
 * @type {string[]}
 */
export const SECTION_IDS = ['hero', 'work', 'about', 'services', 'contact']
