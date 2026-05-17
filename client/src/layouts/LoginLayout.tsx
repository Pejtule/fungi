import { Navigate, Outlet } from 'react-router-dom'
import { useUser } from '#hooks/useUser.ts'
import { cn } from '../helpers/cn'
import { AuthLoading } from '../loaders/AuthLoading'

const ui = {
  container: cn(
    'min-h-dvh grid grid-rows-[1fr_2.5fr]',
    'md:grid-cols-[1.5fr_1fr] md:grid-rows-1',
    'lg:grid-cols-[1fr_1fr]',
    'xl:grid-cols-[1fr_1.5fr]',
    '2xl:grid-cols-[1fr_2fr]',
    'short:flex-1 short:grid-rows-1'
  ),
  mediaFrame: cn(
    'relative',
    'md:order-2',
    'short:hidden'
  ),
  image: cn(
    'absolute left-0 right-0 top-0 bottom-1 bg-cover bg-center',
    'md:bottom-0',
    'short:hidden'
  ),
  ellipse: cn(
    'absolute left-0 right-0 bottom-0 z-30 h-14 bg-bg',
    '[clip-path:ellipse(55%_100%_at_50%_100%)]',
    'md:hidden',
    'short:hidden'
  ),
  login: cn(
    'md:order-1'
  )
}

export const LoginLayout = () => {
  const { user, isLoading } = useUser()

  if (isLoading) return <AuthLoading />
  if (user) return <Navigate to='/admin' replace />

  return (
    <div className={ui.container}>
      <div className={ui.mediaFrame}>
        <div className={ui.image} style={{ backgroundImage: "url('/login.JPG')" }} />
        <div className={ui.ellipse} />
      </div>

      <div className={ui.login}>
        <Outlet />
      </div>
    </div>
  )
}
