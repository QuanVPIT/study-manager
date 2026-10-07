import { useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'

export type Theme = 'light' | 'dark' | 'system'

// Does the computer (macOS / Windows / phone) prefer dark mode right now?
const systemDark = window.matchMedia('(prefers-color-scheme: dark)')

// Remembers your theme choice and applies it to the page.
export function useTheme() {
  // Saved in localStorage as "theme", so your choice survives a refresh
  const [theme, setTheme] = useLocalStorage<Theme>('theme', 'system')

  useEffect(() => {
    // Add or remove the "dark" class on <html>. All "dark:" classes depend on it.
    function apply() {
      const isDark = theme === 'dark' || (theme === 'system' && systemDark.matches)
      document.documentElement.classList.toggle('dark', isDark)
    }
    apply()

    // In "system" mode, follow the computer when it switches (e.g. automatically at night)
    systemDark.addEventListener('change', apply)
    // "Cleanup": stop listening when the theme changes or the app closes
    return () => systemDark.removeEventListener('change', apply)
  }, [theme])

  return [theme, setTheme] as const
}
