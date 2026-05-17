export type Theme = 'light' | 'dark'
export type Listener = (theme: Theme) => void

const STORAGE_KEY = 'theme'
let listeners: Listener[] = []

export function getTheme() {
  return (document.documentElement.dataset.theme as Theme) || 'light'
}

export function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme

  if (theme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }

  localStorage.setItem(STORAGE_KEY, theme)
  listeners.forEach((fn) => fn(theme))
}

interface InitOptions {
  respectSystem?: boolean
  watchSystem?: boolean
}

export function initTheme(options: InitOptions = {}): void {
  const {
    respectSystem = true,
    watchSystem = true
  } = options

  const saved = localStorage.getItem(STORAGE_KEY) as Theme | null

  if (saved) {
    setTheme(saved)
  } else if (respectSystem) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setTheme(prefersDark ? 'dark' : 'light')
  }

  if (watchSystem) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', e => {
      const userSet = localStorage.getItem(STORAGE_KEY)
      if (!userSet) {
        setTheme(e.matches ? 'dark' : 'light')
      }
    })
  }
}

export function toggleTheme(): void {
  const current = getTheme()
  const next = current === 'dark' ? 'light' : 'dark'
  setTheme(next)
}

export function onThemeChange(callback: Listener) {
  listeners.push(callback)

  return () => {
    listeners = listeners.filter((fn) => fn !== callback)
  }
}
