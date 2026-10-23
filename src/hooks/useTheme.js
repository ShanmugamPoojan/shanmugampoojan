import { useCallback, useEffect, useState } from 'react'

const KEY = 'pf-theme'
const COLORS = { dark: '#131315', light: '#eeebe3' }

const read = () => {
  try {
    return localStorage.getItem(KEY) === 'light' ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
}

export default function useTheme() {
  const [theme, setTheme] = useState(read)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', COLORS[theme])
    try {
      localStorage.setItem(KEY, theme)
    } catch {
      /* storage unavailable, ignore */
    }
  }, [theme])

  const toggle = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), [])
  return { theme, toggle }
}
