/**
 * Shared id builders for the skills tablist.
 *
 * In their own module, component-free, for two reasons:
 *
 *   1. React Fast Refresh only preserves state when a file exports *either*
 *      components or plain values, never both. Exporting these from
 *      `SkillCategories.jsx` made every edit to that file remount the section
 *      and reset the selected category.
 *   2. The tab and the panel live in different files but must agree on the
 *      exact same strings — `aria-controls` and `aria-labelledby` are matched
 *      by id, and a mismatch fails silently: the wiring simply does not exist
 *      as far as assistive tech is concerned, with nothing in the console.
 *
 * @param {string} id Category id.
 */
export const tabId = (id) => `skills-tab-${id}`

/** @param {string} id Category id. */
export const panelId = (id) => `skills-panel-${id}`
