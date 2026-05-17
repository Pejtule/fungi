import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import { cn } from './helpers/cn'

const ui = cn(
  'min-h-screen min-w-screen',
  'bg-zinc-50 dark:bg-zinc-900',
  'font-poppins text-zinc-900 dark:text-zinc-100',
  'transition-colors'
)

export const App = () => (
  <div className={ui}>
    <RouterProvider router={router} />
  </div>
)
