import type { StatusType, StorageType, MediaType, MediaMime, MediaFormat } from '../media.domain.js'

export interface ImageMediaDTO {
  id: string
  version: number
  status: StatusType
  storage: StorageType
  key: string
  checksum: string 
  originalName: string
  type: MediaType
  mimetype: MediaMime
  format: MediaFormat | null
  size: number
  width?: number | undefined
  height?: number | undefined
  aspectRatio?: number | undefined
  orientation?: number | null
  squareCrop?: ImageCrop | null
  landscapeCrop?: ImageCrop | null
  portraitCrop?: ImageCrop | null
}

export interface ImageDetails {
  width: number
  height: number
  aspectRatio: number // width / height
  orientation: number | null
}

export interface ImageCrop {
  x: number
  y: number
  width: number
  height: number
}

export interface ImageVariant {
  crop: ImageCrop
}

export enum ImageVariantType {
  SQUARE = 'square',
  PORTRAIT = 'portrait',
  LANDSCAPE = 'landscape'
}

export enum ImageMime {
  JPEG = 'image/jpeg',
  PNG = 'image/png',
  WEBP = 'image/webp',
  AVIF = 'image/avif',
  GIF = 'image/gif',
}

export enum ImageFormat {
  JPEG = 'jpeg',
  PNG = 'png',
  WEBP = 'webp',
  AVIF = 'avif',
  GIF = 'gif',
}

export const imageSizes= {
  thumbnail: { width: 200, height: 200, format: 'webp' },
  small: { width: 600, format: 'webp' },
  medium: { width: 1200, format: 'webp' },
  large: { width: 2000, format: 'webp' },
  fallback: { width: 1200, format: 'jpeg' },
} as const
