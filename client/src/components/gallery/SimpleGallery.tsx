import { useEffect, useRef } from 'react'
import PhotoSwipeLightbox from 'photoswipe/lightbox'
import 'photoswipe/style.css'
import type { GalleryImage } from '../../types/Mushroom'

const ui = {
  galleryButton: 'w-max h-max px-6 py-3 rounded-md bg-border transition-colors',
  hover: 'hover:bg-border/70',
}

type SimpleGalleryProps = {
  images: GalleryImage[]
  label: string
}

export const SimpleGallery = ({ images, label }: SimpleGalleryProps) => {
  const galleryRef = useRef<HTMLDivElement | null>(null)
  const lightboxRef = useRef<PhotoSwipeLightbox | null>(null)

  // Převod GalleryImage → PhotoSwipe items
  const items = images.map(img => ({
    src: img.full.url,
    width: img.full.width,
    height: img.full.height,
  }))

  useEffect(() => {
    if (!galleryRef.current) return

    const lightbox = new PhotoSwipeLightbox({
      gallery: galleryRef.current,  // ⭐ DOM element
      children: 'a',                // ⭐ musí odpovídat <a> v DOM
      dataSource: items,            // ⭐ tvoje data
      pswpModule: () => import('photoswipe'),
    } as any)

    lightbox.init()
    lightboxRef.current = lightbox

    return () => {
      lightbox.destroy()
      lightboxRef.current = null
    }
  }, [items])

  const openGallery = () => {
    // ⭐ Lightbox otevře galerii, protože má <a> v DOM
    lightboxRef.current?.loadAndOpen(0)
  }

  return (
    <>
      <button
        onClick={openGallery}
        className={ui.galleryButton}
      >
        {label}
      </button>

      {/* ⭐ Neviditelná galerie — MUSÍ obsahovat <a>, jinak PSWP 5.4.4 nefunguje */}
      <div
        ref={galleryRef}
        style={{
          position: 'absolute',
          left: '-9999px',
          top: 0,
          width: 0,
          height: 0,
          overflow: 'hidden',
        }}
      >
        {items.map((item, i) => (
          <a
            key={i}
            href={item.src}
            data-pswp-width={item.width}
            data-pswp-height={item.height}
          />
        ))}
      </div>
    </>
  )
}
