import { Overlay } from '../components/Overlay'
import { Header, useHeader } from './Header'
import { Footer } from './Footer'

const ui = 'flex-1 grid grid-rows-[auto_1fr_auto] bg-zinc-50 dark:bg-zinc-900'

export const DetailPageLayout = ({ children }: { children: React.ReactNode }) => {
  const header = useHeader('public')

  return (
    <Overlay>
      <div className={ui}>
        <Header {...header} />
          {children}
        <Footer />
      </div>
    </Overlay>
  )
}
