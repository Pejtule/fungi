import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import type { GalleryImage } from '../../types/Mushroom'


type ImageSliderProps = {
  images: GalleryImage[]
  imageIndex: number
  setImageIndex: (i: number) => void
  openGallery: (startIndex: number) => void
}

export const ImageSlider = ({ images, imageIndex, setImageIndex, openGallery }: ImageSliderProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
  })

  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setImageIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return

    setScrollSnaps(emblaApi.scrollSnapList())
    emblaApi.on('select', onSelect)
    onSelect()
  }, [emblaApi, onSelect])

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  )

  return (
    <div className='w-full '>
      {/* SLIDER */}
      <div className='overflow-hidden w-full' ref={emblaRef}>
        <div className='flex'>
          {images.map((image) => (
            <img
              key={image.id}
              src={image.medium.url}
              className='w-full shrink-0 select-none'
              draggable={false}
              onClick={() => openGallery(imageIndex)}
            />
          ))}
        </div>
      </div>

      {/* DOTS */}
      <div className='flex justify-center gap-2 mt-4'>
        {scrollSnaps.map((_, i) => {
          const active = i === imageIndex

          return (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={`
    h-2.5 w-2.5 rounded-full transition-all
    ${i === imageIndex ? 'bg-black opacity-80 scale-110' : 'bg-black opacity-30'}
  `}
              style={{
                WebkitTransform: i === imageIndex ? 'scale(1.1)' : 'scale(1)',
                WebkitTransition: 'opacity 0.2s ease, transform 0.2s ease',
              }}
            />
          )
        })}
      </div>
    </div>
  )
}
