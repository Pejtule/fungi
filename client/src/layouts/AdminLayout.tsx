import { Navigate, Outlet } from 'react-router-dom'
import { useUser } from '../hooks/useUser.ts'
import { AuthLoading } from '../loaders/AuthLoading.tsx'
import { Header, useHeader } from './Header.tsx'

const ui = 'min-h-screen flex flex-col'

export const AdminLayout = () => {
  const { user, isLoading } = useUser()
  const header = useHeader('admin')

  if (isLoading) return <AuthLoading />

  if (!user) return <Navigate to='/login' replace />

  return (
    <div className={ui}>
      <Header {...header} />
      <Outlet />
    </div>
  )
}
