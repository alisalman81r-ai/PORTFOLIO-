/**
 * Navigation structure.
 *
 * Header, mobile menu, and footer all read from here, so a link is added or
 * renamed in exactly one place and the three can never disagree.
 */

/**
 * @typedef {object} NavLink
 * @property {string} id    Stable key, and the section id the anchor targets.
 * @property {string} label Visible text.
 * @property {string} href  In-page anchor (`#work`) or route path (`/blog`).
 * @property {boolean} [external] Renders an <a rel="noreferrer"> instead of a
 *   react-router <Link>.
 */

/**
 * Primary navigation.
 *
 * Anchors rather than routes, because the portfolio is one scrolling page. Each
 * `href` must match a `<Section id="…">`; `scroll-margin-block-start` in
 * `styles/base.css` keeps the target clear of the floating header.
 *
 * Only `#home` resolves today — the rest are declared ahead of their sections
 * so the nav is complete and the scroll-spy wiring is already correct. An
 * anchor with no matching element simply does nothing when clicked.
 *
 * Swap an entry to a route path (`/blog`) once a section earns its own page;
 * `Header` renders routes and anchors differently and needs no other change.
 *
 * @type {NavLink[]}
 */
export const NAV_LINKS = [
  { id: 'home', label: 'Home', href: '#home' },
  { id: 'about', label: 'About', href: '#about' },
  { id: 'skills', label: 'Skills', href: '#skills' },
  { id: 'projects', label: 'Projects', href: '#projects' },
  { id: 'services', label: 'Services', href: '#services' },
  { id: 'experience', label: 'Experience', href: '#experience' },
  { id: 'testimonials', label: 'Testimonials', href: '#testimonials' },
  { id: 'blog', label: 'Blog', href: '#blog' },
  { id: 'contact', label: 'Contact', href: '#contact' },
]

/**
 * Footer links — a deliberately shorter set. A footer repeating all nine items
 * is a sitemap, not navigation.
 * @type {NavLink[]}
 */
export const FOOTER_LINKS = [
  { id: 'about', label: 'About', href: '#about' },
  { id: 'projects', label: 'Projects', href: '#projects' },
  { id: 'contact', label: 'Contact', href: '#contact' },
]

/**
 * Section ids in scroll order.
 *
 * Lets the scroll-spy highlight the active nav item without hardcoding the
 * order inside the header component.
 *
 * @type {string[]}
 */
export const SECTION_IDS = NAV_LINKS.map((link) => link.id)
