import { useCallback, useEffect, useMemo, useState } from 'react'

import { THEME_STORAGE_KEY, ThemeContext, readInitialTheme } from './themeContext'

/**
 * Provides the active colour theme and applies it to the document.
 *
 * The theme is a `data-theme` attribute on <html>; `styles/theme.css` swaps the
 * semantic CSS variables from there, so no component needs to know which theme
 * is active in order to be styled correctly.
 */
export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(readInitialTheme)

  // Apply to the document and persist. `colorScheme` makes native UI —
  // scrollbars, form controls, the mobile address bar — match.
  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = theme
    root.style.colorScheme = theme

    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch {
      // Storage can be unavailable (private mode, blocked cookies). The theme
      // still applies for this session; only persistence is lost.
    }
  }, [theme])

  // Follow the OS preference until the user makes an explicit choice.
  useEffect(() => {
    let stored = null
    try {
      stored = localStorage.getItem(THEME_STORAGE_KEY)
    } catch {
      /* ignore */
    }
    if (stored) return

    const query = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (event) => setThemeState(event.matches ? 'dark' : 'light')

    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  const setTheme = useCallback((next) => {
    setThemeState(next === 'light' ? 'light' : 'dark')
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((current) => (current === 'dark' ? 'light' : 'dark'))
  }, [])

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme, isDark: theme === 'dark' }),
    [theme, setTheme, toggleTheme],
  )

  return <ThemeContext value={value}>{children}</ThemeContext>
}
