import { SITE } from './site.js'

/**
 * Footer content.
 *
 * Its own file rather than part of `navigation.js`: the footer's *links* come
 * from there (`FOOTER_LINKS`), while the statement and legal line are editorial
 * copy that changes for entirely different reasons.
 *
 * PLACEHOLDER — the statement is generic scaffolding so the layout can be
 * judged with a real line length. Rewrite it in your own voice.
 */
export const FOOTER = {
  /** Sits under the logo. Two lines at most — a footer is not an About page. */
  statement:
    'Frontend developer building fast, accessible web experiences where motion has a purpose and every detail is deliberate.',

  /** Prompt above the contact link. */
  ctaLabel: 'Have something in mind?',

  /**
   * Copyright line.
   *
   * The year is computed at render, not typed. A hardcoded year is wrong on
   * 1 January and stays wrong until somebody notices — which on a portfolio is
   * usually a visitor rather than the owner.
   *
   * @param {number} year
   * @returns {string}
   */
  copyright: (year) => `© ${year} ${SITE.name}. All rights reserved.`,

  /** Small print beside the copyright. */
  colophon: 'Built with React, Tailwind CSS, GSAP and Motion.',
}
