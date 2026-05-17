import { memo } from 'react'
import { useDeviceCapabilities, useHoverCapability } from '../hooks/shared/useDeviceCapabilities'
import { cn } from '../helpers/cn'
import { Image } from './gallery/Image'

const ui = {
  card: 'relative group',
  mediaFrame: 'overflow-hidden aspect-square',
  img: 'w-full h-full object-cover',
  h2: cn(
    'absolute inset-x-0 flex flex-col text-center pointer-events-none',
    'px-3 drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]',
  ),
  h2Hover: cn(
    'inset-0 items-center justify-center text-center',
    'opacity-0 group-hover:opacity-100 transition-opacity duration-300',
  ),
  h2Touch: 'bottom-2 items-start text-left opacity-100',
  title: 'text-white text-lg font-semibold uppercase leading-snug',
  subtitle: 'text-white/90 text-sm font-medium italic normal-case mt-0.5',
  overlay: 'absolute inset-0 pointer-events-none',
  overlayHover: cn(
    'bg-gradient-to-t from-black/60 via-black/20 to-transparent',
    'backdrop-blur-sm',
    'opacity-0 group-hover:opacity-100 transition-opacity duration-300',
  ),
  overlayTouch: cn(
    'bg-gradient-to-t from-black/50 via-black/10 to-transparent',
    "after:content-[''] after:absolute after:inset-x-0 after:bottom-0 after:h-24",
    'after:bg-gradient-to-t after:from-black/80 after:to-transparent',
  ),
}

export type CardProps = {
  id: string
  title: string
  subtitle: string
  thumbnail: {
    url: string
    width: number
    height: number
    alt: string
  }
}


export const Card = memo(({ title, subtitle, thumbnail }: CardProps) => {
  const { isHoverable } = useDeviceCapabilities()

  return (
    <div className={ui.card}>
      <div className={ui.mediaFrame}>
        <Image
          src={thumbnail.url}
          width={thumbnail.width}
          height={thumbnail.height}
          alt={thumbnail.alt}
          className={ui.img}
          sizes="(max-width: 600px) 100vw, 200px"
          tabIndex={-1}
          aria-hidden="true"
          draggable="false"
        />
      </div>
      <div className={`${isHoverable ? ui.overlayHover : ui.overlayTouch} ${ui.overlay}`} />
      <h2 className={`${ui.h2} ${isHoverable ? ui.h2Hover : ui.h2Touch}`}>
        <span className={ui.title}>{title}</span>
        <span className={ui.subtitle}>{subtitle}</span>
      </h2>
    </div>
  )
}, (prev, next) => prev.id === next.id)

Card.displayName = 'MushroomCard'