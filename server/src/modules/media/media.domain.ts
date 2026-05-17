import { ImageMime, ImageFormat, type ImageDetails, ImageVariantType, type ImageVariant } from './image/image.domain.js'
import { VideoMime, VideoFormat, type VideoDetails, VideoVariantType, type VideoVariant } from './video/video.domain.js'

export interface Media {
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
  details: MediaDetails | null
  variants: Partial<Record<MediaVariantKey, MediaVariant>> | null
  createdAt: Date
  updatedAt: Date
}

export enum StatusType {
  PENDING = 'pending',
  READY = 'ready',
  FAILED = 'failed'
}

export enum StorageType {
  LOCAL = 'local',
  S3 = 's3',
  GCS = 'gcs',
  AZURE = 'azure',
  CLOUDFLARE = 'cloudflare',
  IPFS = 'ipfs',
  CDN = 'cdn'
}

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  FILE = 'file'
}

export type MediaMime = ImageMime | VideoMime
export type MediaFormat = ImageFormat | VideoFormat
export type MediaDetails = ImageDetails | VideoDetails
export type MediaVariantKey = ImageVariantType | VideoVariantType
export type MediaVariant = ImageVariant | VideoVariant

export const statuses = Object.values(StatusType)
export const storages = Object.values(StorageType)
export const types = Object.values(MediaType)
export const mimetypes = [...Object.values(ImageMime), ...Object.values(VideoMime)]
export const formats = [...Object.values(ImageFormat), ...Object.values(VideoFormat)]
export const variantKeys = [...Object.values(ImageVariantType), ...Object.values(VideoVariantType)] as const
