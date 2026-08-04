import { useContext } from 'react'

import { ThemeContext } from '@/context/themeContext'

/**
 * Access the active colour theme and its setters.
 *
 * @returns {import('@/context/themeContext').ThemeContextValue}
 * @throws If called outside <ThemeProvider>.
 *
 * @example
 * const { isDark, toggleTheme } = useTheme()
 */
export function useTheme() {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useTheme() must be called inside a <ThemeProvider>.')
  }

  return context
}
