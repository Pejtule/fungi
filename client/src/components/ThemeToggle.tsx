import { useTheme } from '../theme/useTheme'
import { SunIcon } from './icons/SunIcon'
import { MoonIcon } from './icons/MoonIcon'

export const ThemeToggle = ({ className }: { className?: string }) => {
  const { theme, handleClick } = useTheme()

  return (
    <button onClick={handleClick} className={className}>
      {theme === 'light' ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}
