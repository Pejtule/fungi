import { useState } from 'react'
import { useDeviceCapabilities } from '../../hooks/shared/useDeviceCapabilities'
import type { GalleryImage } from '../../types/Mushroom'
import { ImageSlider } from './ImageSlider'
import { SimpleGallery } from './SimpleGallery'

const t = {
  openGallery: 'Zobrazit ve fotogalerii',
}

type GalleryProps = {
  images: GalleryImage[]
  placement?: 'left' | 'right' | 'bottom'
  count?: number
  size?: number
}


export const Gallery = ({ images, placement = 'left', count = 4, size = 450 }: GalleryProps) => {
  if (!images || images.length === 0) {
    return null
  }

  const { isHoverable, isLandscape, pointer } = useDeviceCapabilities()
  const [imageIndex, setImageIndex] = useState(0)
  const image = images[imageIndex]
  const direction = placement === 'bottom' ? 'horizontal' : 'vertical'
  const galleryLabel = `${t.openGallery} (${images.length})`
  const thumbnailsCount = Math.min(images.length, count)

  const ui = {
    galleryButton: 'w-max h-max px-6 py-3 rounded-md bg-border transition-colors',
    hover: 'hover:bg-border/70',
  }

  // ⭐ UI
  const main = <img src={image.medium.url} />
  const panel = (
    <GalleryThumbnails
      images={images}
      direction={direction}
      count={thumbnailsCount}
      onSelect={setImageIndex}
    />
  )

  const openGallery = (index: number) => {
    setImageIndex(index)
  }

  // ⭐ MOBILE
  if (pointer === 'coarse') {
    return (
      <>
        <div className={`${isLandscape ? 'w-[275px]' : ''} md:w-[400px] h-max grid`}>
          {images.length > 1 ? (
            <ImageSlider
              images={images}
              imageIndex={imageIndex}
              setImageIndex={setImageIndex}
              openGallery={openGallery}
            />
          ) : <img src={images[0].medium.url} />}  {/* doplnit */}
        </div>
      </>
    )
  }

  // ⭐ DESKTOP — 1 obrázek
  if (images.length <= 1) {
    return (
      <>
        <div className='w-[450px] grid gap-6'>
          {main}
          <SimpleGallery images={images} label={galleryLabel} />
        </div>
      </>
    )
  }

  // ⭐ DESKTOP — více obrázků
  return (
    <>
      <div className='grid gap-6'>
        <GalleryLayout {...{ placement, size, count: thumbnailsCount, main, panel }} />
        <SimpleGallery images={images} label={galleryLabel} />
      </div>
    </>
  )
}


type GalleryLayoutProps = {
  placement: 'left' | 'right' | 'bottom'
  size: number
  count: number
  main: React.ReactNode
  panel: React.ReactNode
}

export const GalleryLayout = ({ placement, size, count, main, panel }: GalleryLayoutProps) => {
  const ui = {
    container: '',
    bottom: `w-[var(--gallery-size-px)] h-fit grid grid-rows-[var(--gallery-size-px)_var(--gallery-panel-px)] gap-[10px]`,
    right: `w-fit h-[var(--gallery-size-px)] grid grid-cols-[var(--gallery-size-px)_var(--gallery-panel-px)] gap-[10px]`,
    left: `w-fit h-[var(--gallery-size-px)] grid grid-cols-[var(--gallery-panel-px)_var(--gallery-size-px)] gap-[10px]`,
    main: 'h-[var(--gallery-size-px)]',
    panel: 'h-full min-h-0 w-full grid auto-rows-fr overflow-hidden',
  }
  const layout =
    placement === 'left'
      ? ui.left
      : placement === 'right'
        ? ui.right
        : ui.bottom

  const css = {
    '--gallery-size': size,
    '--gallery-count': count,
    '--gallery-panel': `calc((var(--gallery-size) / var(--gallery-count)) - 10)`,
    '--gallery-size-px': `calc(var(--gallery-size) * 1px)`,
    '--gallery-panel-px': `calc(var(--gallery-panel) * 1px)`,
  } as React.CSSProperties

  return (
    <div className={layout} style={css}>
      {placement === 'left' && <div className={ui.panel}>{panel}</div>}
      <div className={ui.main}>{main}</div>
      {placement !== 'left' && <div className={ui.panel}>{panel}</div>}
    </div>
  )
}

type GalleryThumbnailsProps = {
  images: GalleryImage[]
  direction: 'vertical' | 'horizontal'
  count: number
  onSelect: (index: number) => void
}

export const GalleryThumbnails = ({
  images,
  direction,
  count,
  onSelect,
}: GalleryThumbnailsProps) => {
  const ui = {
    list: 'grid h-full w-full min-h-0 gap-[10px]',
    item: 'h-full min-h-0',
    frame: 'w-full h-full overflow-hidden',
    image: 'object-cover w-full h-full block',
  }

  const style =
    direction === 'vertical'
      ? { gridTemplateRows: `repeat(${count}, minmax(0, 1fr))` }
      : { gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }


  const layout =
    direction === 'vertical'
      ? `grid-rows-[repeat(${count},minmax(0,1fr))]`
      : `grid-cols-[repeat(${count},minmax(0,1fr))]`


  return (
    <ul className='grid h-full w-full min-h-0 gap-[10px]' style={style}>
      {images.slice(0, count).map((image, i) => (
        <li key={image.id} className={ui.item}>
          <button className={ui.frame} onClick={() => onSelect(i)}>
            <img
              src={image.thumbnail.url}
              alt={image.alt}
              className={ui.image}
            />
          </button>
        </li>
      ))}
    </ul>
  )
}
