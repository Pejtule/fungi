import crypto from 'crypto'
import { MediaType } from './media.domain.js'
import { ImageFormat } from './image/image.domain.js'
import { VideoFormat } from './video/video.domain.js'
import { extractImageMetadata } from './image/image.processor.js'
import { extractVideoMetadata } from './video/video.processor.js'
import type { MediaListQuery } from './media.schema.js'

export const createChecksum = (buffer: Buffer) => {
  return crypto.createHash('sha1').update(buffer).digest('hex')
}

export const extractMetadata = async (type: MediaType, key: string) => {
  switch (type) {
    case MediaType.IMAGE:
      return await extractImageMetadata(key)
    case MediaType.VIDEO:
      return extractVideoMetadata(key)
  }
}

export const getAllowedFormats = (type: MediaType) => {
  switch (type) {
    case MediaType.IMAGE:
      return Object.values(ImageFormat)
    case MediaType.VIDEO:
      return Object.values(VideoFormat)
  }
}

export const buildMediaFilter = (query: MediaListQuery) => {
  const ids = query.ids ?? undefined
  const filter: Record<string, unknown> = {}

  if (ids) {
    filter._id = { $in: ids }
  }

  return filter
}
