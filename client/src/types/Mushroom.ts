export interface MushroomList {
  total: number
  items: MushroomListItem[]
  limit: number
  offset: number
  nextOffset: number
  prevOffset: number
  hasNextPage: boolean,
  hasPrevPage: boolean
}

export interface MushroomListItem {
  id: string
  latin: string
  cs: string
  thumbnail: {
    url: string
    width: number
    height: number
    alt: string
  }
}

export interface MushroomDetail {
  id: string
  speciesId: string
  lineageIds: string[]
  latin: string
  cs: string
  gallery: GalleryImage[]
}

export interface GalleryImage {
  id: string
  full: ImageRendition,
  medium: ImageRendition,
  thumbnail: ImageRendition
  alt: string
}

export interface ImageRendition {
  url: string
  width: number
  height: number
}
