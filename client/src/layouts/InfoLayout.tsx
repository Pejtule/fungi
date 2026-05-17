import { cn } from '../helpers/cn'

const ui = {
  container: cn(
    'min-h-0 flex-1 flex items-center justify-center',
    '@container/info'
  ),
  box: cn(
    'grid',
    '@md/info:grid-cols-[1fr_350px] @md/info:gap-10'
  ),
  image: cn(
    'flex justify-center',
    '@md/info:order-2 @md/info:p-10',
    'short:p-2'
  ),
  info: cn(
    'flex items-center justify-center',
    '@md/info:order-1'
  )
}

export type InfoLayoutProps = {
  info: React.ReactNode
  image: React.ReactNode
}

export const InfoLayout = ({ info, image }: InfoLayoutProps) => (
  <div className={ui.container}>
    <div className={ui.box}>
      <div className={ui.image}>{image}</div>
      <div className={ui.info}>{info}</div>
    </div>
  </div>
)
