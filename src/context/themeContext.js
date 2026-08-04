import { createContext } from 'react'

/**
 * Theme context object and its constants.
 *
 * Kept in a component-free module on purpose: React Fast Refresh only preserves
 * state when a file exports *either* components or plain values, never both.
 * Splitting the context out is what lets `ThemeProvider.jsx` hot-reload without
 * remounting the tree.
 */

/** @typedef {'dark'|'light'} Theme */

export const THEME_STORAGE_KEY = 'theme'

/**
 * @typedef {object} ThemeContextValue
 * @property {Theme} theme
 * @property {(theme: Theme) => void} setTheme
 * @property {() => void} toggleTheme
 * @property {boolean} isDark
 */

export const ThemeContext = createContext(/** @type {ThemeContextValue|null} */ (null))

/**
 * Read the theme the pre-paint script in `index.html` already resolved.
 * Reading from the DOM instead of re-deriving it keeps React's first render in
 * agreement with what the user is already looking at.
 *
 * @returns {Theme}
 */
export function readInitialTheme() {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
}
