import { useState, useEffect } from 'react'

export function useGTMTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const stored = localStorage.getItem('gtm_theme') as 'light' | 'dark' | null
    if (stored) setTheme(stored)
  }, [])

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    localStorage.setItem('gtm_theme', next)
  }

  return { theme, toggleTheme }
}
