import { Outlet } from 'react-router-dom'
import { Header, useHeader } from './Header'
import { Footer } from './Footer'

const ui = 'min-h-screen grid grid-rows-[auto_1fr_auto]'

export const PublicLayout = () => {

  const header = useHeader('public')

  return (
    <div className={ui}>
      <Header {...header} />
      <Outlet />
      <Footer />
    </div>
  )
}
