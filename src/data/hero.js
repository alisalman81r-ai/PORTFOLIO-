/**
 * Hero section content.
 *
 * The hero is the highest-stakes copy on the site, so it lives as structured
 * data rather than inline JSX — headline lines can be re-broken, roles
 * re-ordered, and CTAs re-pointed without touching a component.
 *
 * PLACEHOLDER — the headline and description are written as real, usable copy
 * so the layout can be judged with true line lengths, but they are generic by
 * design. Replace them with your own voice; the structure will hold.
 *
 * `PERSONAL.name` is intentionally left as its `YOUR NAME` placeholder in
 * `personal.js` — it renders in the hero eyebrow, where an obviously unfilled
 * slot is a useful reminder and a fabricated name would not be.
 */

/**
 * @typedef {object} HeroCta
 * @property {string} label
 * @property {string} href
 * @property {'primary'|'secondary'} variant
 * @property {string} [icon] Lookup key resolved by the component.
 */

export const HERO = {
  /** Availability pill above the headline. */
  badge: {
    label: 'Available for new work',
    /** Drives the pulsing indicator dot. Mirror `PERSONAL.available`. */
    active: true,
  },

  /**
   * Headline, split into lines.
   *
   * Explicit lines rather than one string with `<br>`: each line gets its own
   * masked reveal, and the break points stay a content decision instead of
   * being at the mercy of the container width.
   *
   * `accent` marks the word rendered in the italic serif with a gradient fill —
   * one emphasised word per headline, never more.
   */
  headline: [
    { text: 'Building digital' },
    { text: 'products that feel' },
    { text: 'inevitable', accent: true },
  ],

  /**
   * Words cycled by the animated subtitle.
   *
   * Keep them a similar length — the container reserves width for the longest,
   * so one outlier leaves a visible gap beside all the others.
   */
  subtitlePrefix: 'Designer and developer crafting',
  subtitleRotating: ['interfaces', 'identities', 'experiences', 'systems'],

  description:
    'I design and build fast, accessible web experiences where motion has a purpose and every detail is deliberate — from the first pixel to the last frame.',

  /** @type {HeroCta[]} */
  ctas: [
    { label: 'View projects', href: '#projects', variant: 'primary', icon: 'arrow' },
    { label: 'Get in touch', href: '#contact', variant: 'secondary', icon: 'mail' },
  ],

  /**
   * Small proof points under the CTAs.
   *
   * Left at zero deliberately — these are factual claims. Fill them in or
   * delete the array; a section rendering `0+ projects shipped` is worse than
   * no stats at all, so the component skips the block when every value is 0.
   */
  stats: [
    { id: 'experience', value: 0, suffix: '+', label: 'Years experience' },
    { id: 'projects', value: 0, suffix: '+', label: 'Projects shipped' },
    { id: 'clients', value: 0, suffix: '+', label: 'Happy clients' },
  ],

  /** Labels on the floating chips in the visual composition. */
  chips: [
    { id: 'react', label: 'React', icon: 'atom' },
    { id: 'motion', label: 'Motion', icon: 'sparkles' },
    { id: 'performance', label: '60 FPS', icon: 'gauge' },
  ],
}
