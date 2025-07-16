// frontend/components/theme-provider.tsx

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'
type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}
type ContextType = { theme: Theme; setTheme: (t: Theme) => void }

const ThemeContext = createContext<ContextType | null>(null)

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'quantx-ui-theme',
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      return (localStorage.getItem(storageKey) as Theme) || defaultTheme
    } catch {
      return defaultTheme
    }
  })

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('light', 'dark')

    const effectiveTheme = theme === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : theme

    root.classList.add(effectiveTheme)
    localStorage.setItem(storageKey, theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme: setThemeState }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
