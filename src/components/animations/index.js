/**
 * Animation components — behaviour wrappers with no appearance of their own.
 *
 * Each one takes children and adds motion. None renders visible markup, which
 * is what lets them wrap any content without constraining its design.
 *
 * The split from `@/animations`: that directory holds the *vocabulary*
 * (variants, easings, GSAP factories); this one holds the React bindings that
 * apply it. Non-React code can use the vocabulary; only components live here.
 *
 *   import { Reveal, Stagger, StaggerItem } from '@/components/animations'
 */

export { Reveal } from './Reveal'
export { Stagger, StaggerItem } from './Stagger'
export { Parallax } from './Parallax'
export { TextReveal } from './TextReveal'
