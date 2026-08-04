import {
  SiCss,
  SiDocker,
  SiExpress,
  SiFigma,
  SiFirebase,
  SiGit,
  SiGithub,
  SiHtml5,
  SiJavascript,
  SiMongodb,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPrisma,
  SiReact,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
} from 'react-icons/si'

import { Icon } from './Icon'

/**
 * Official technology marks, from Simple Icons via `react-icons/si`.
 *
 * Named imports, never `si[name]` — a dynamic key defeats tree-shaking and
 * would pull all ~3,000 brand marks into the bundle.
 *
 * NOT INCLUDED, DELIBERATELY
 * `VS Code` has no entry here. Simple Icons dropped the mark over Microsoft's
 * trademark, and the nearest available logo belongs to VSCodium — a different
 * product. Showing one product's logo to represent another is wrong, so the
 * data uses `code` and falls through to the generic glyph below.
 */
const BRAND_MARKS = {
  html: SiHtml5,
  css: SiCss,
  javascript: SiJavascript,
  react: SiReact,
  nextjs: SiNextdotjs,
  tailwind: SiTailwindcss,
  node: SiNodedotjs,
  express: SiExpress,
  mongodb: SiMongodb,
  firebase: SiFirebase,
  git: SiGit,
  github: SiGithub,
  figma: SiFigma,
  vercel: SiVercel,
  typescript: SiTypescript,
  postgresql: SiPostgresql,
  prisma: SiPrisma,
  docker: SiDocker,
}

/**
 * Resolves a technology icon, falling back to the lucide registry.
 *
 * One lookup for two sources: brand marks for products, generic glyphs for
 * disciplines like Accessibility or Design Systems that have no logo. Consumers
 * pass a string and never need to know which set it came from — which is what
 * lets a skill move between the two without touching a component.
 *
 * MONOCHROME BY DESIGN
 * Brand marks render in `currentColor` rather than their official palettes.
 * Eighteen competing brand hues on one dark canvas reads as a sponsor wall, not
 * a portfolio — and it would wreck the contrast discipline the rest of the site
 * keeps. The marks stay authentic; only the fill is ours. Colour is reserved
 * for the accent tint on hover, where it means something.
 *
 * Always decorative: every usage sits beside a visible name, so announcing the
 * icon too would just repeat it.
 *
 * @param {object} props
 * @param {string} props.name Brand key, or any key from the lucide registry.
 * @param {string} [props.className] Size and colour, e.g. 'size-6 text-muted'.
 */
export function TechIcon({ name, className, ...rest }) {
  const Brand = BRAND_MARKS[name]

  if (Brand) {
    return <Brand className={className} aria-hidden="true" focusable="false" {...rest} />
  }

  return <Icon name={name} className={className} {...rest} />
}
