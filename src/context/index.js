/**
 * Barrel export for context.
 *
 * The `useTheme` consumer hook lives in `@/hooks` so that this directory stays
 * limited to providers and context objects.
 */

export { AppProviders } from './AppProviders'
export { ThemeProvider } from './ThemeProvider'
export { ThemeContext, THEME_STORAGE_KEY } from './themeContext'
