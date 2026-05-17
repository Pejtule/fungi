import { Suspense } from 'react'
import { AdminPageLoading } from '../loaders/AdminPageLoading'

export const AdminPage = () => (
  <Suspense fallback={<AdminPageLoading />}>
    <Admin />
  </Suspense>
)

export const Admin = () => {
  return (
    <main className='flex-1'>ADMINISTRACE</main>
  )
}
