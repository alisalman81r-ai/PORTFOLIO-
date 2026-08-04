/**
 * Hero section.
 *
 * A folder rather than a single file because the section has three distinct
 * concerns — content, atmosphere, and the visual composition — and each is
 * substantial enough to reason about on its own.
 *
 * The convention: a section stays a single file until one of its parts is
 * independently meaningful, then it becomes a folder with this barrel. Only
 * `Hero` is public; `HeroBackground` and `HeroVisual` are implementation
 * details and are intentionally not re-exported.
 */

export { Hero } from './Hero'
