import { useDeviceCapabilities } from '../hooks/shared/useDeviceCapabilities'
import { useElementWidth } from '../hooks/shared/useElementWidth'
import type { GalleryImage } from '../types/Mushroom'
import { Gallery } from './gallery/Gallery'

const ui = {
  hero: 'w-full h-[calc(var(--vh)*100-var(--header-height))] grid place-content-center md:grid-cols-[auto_1fr] gap-6 p-2 md:p-10',
  h2: 'flex flex-col gap-3.5',
  title: 'text-2xl lg:text-4xl text-black/85 dark:text-white/85 font-semibold uppercase',
  subtitle: 'text-xl lg:text-2xl text-black/60 dark:text-white/60 font-thin italic',
}

export type HeroProps = {
  title: string
  subtitle: string
  gallery: GalleryImage[]
}

export const Hero = ({ title, subtitle, gallery }: HeroProps) => {
  const { isLandscape } = useDeviceCapabilities()
  const { ref, width } = useElementWidth<HTMLDivElement>()
  const isMiddle = width >= 768

  return (
    <div ref={ref} className={ui.hero}>
      <Gallery images={gallery} placement={isMiddle ? 'left' : 'bottom'} size={isMiddle || !isLandscape ? 450 : 300} />
      <h2 className={`${ui.h2} min-h-0 overflow-hidden px-2`}>
        <span className={ui.title}>{title}</span>
        <span className={ui.subtitle}>{subtitle}</span>
      </h2>
    </div>
  )
}
