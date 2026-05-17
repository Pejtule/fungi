import { Link } from 'react-router-dom'
import { useDeviceCapabilities } from '#hooks/shared/useDeviceCapabilities.ts'
import { cn } from '../helpers/cn'
import { InfoLayout } from '../layouts/InfoLayout'
import { t } from '../t'

const ui = {
  main: 'min-h-0 flex-1 flex',
  container: 'flex-1 flex flex-col items-center justify-center gap-6 px-4',
  title: 'text-6xl font-semibold tracking-tight',
  subtitle: 'text-lg text-gray-600 dark:text-gray-200',
  back: cn(
    'inline-flex items-center rounded-md px-4 py-2',
    'bg-gray-900 dark:bg-gray-700 text-white transition-colors',
    'focus:outline-none cursor-pointer [touch-action:manipulation] select-none'
  ),
  hover: 'hover:bg-gray-700 dark:hover:bg-gray-500',
  focus: 'focus-visible:ring-1 focus-visible:ring-blue-400'
}

export const NotFoundPage = ({ to }: { to: string }) => {
  const { isHoverable, usingKeyboard } = useDeviceCapabilities()

  const layout = {
    info: (
      <div className={ui.container}>
        <h1 className={ui.title}>{t.errors.notFound.title}</h1>
        <p className={ui.subtitle}>{t.errors.notFound.subtitle}</p>
        <Link to={to} className={cn(ui.back, isHoverable && ui.hover, usingKeyboard && ui.focus)}>{t.errors.notFound.back}</Link>
      </div>
    ),
    image: <img src='/sadBasket.svg' alt={t.errors.notFound.imgAlt} />
  }

  return (
    <main className={ui.main}>
      <InfoLayout {...layout} />
    </main>
  )
}
