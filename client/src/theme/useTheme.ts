import { useState, useEffect } from 'react'
import { getTheme, toggleTheme, onThemeChange } from '.'

export function useTheme() {
  const [theme, setTheme] = useState(getTheme())

  useEffect(() => {
    return onThemeChange(setTheme)
  }, [])

  const handleClick = () => {
    toggleTheme()
  }

  return { theme, handleClick }
}
