import sharp from 'sharp'
import { getObjectBuffer, getObjectStream } from '#infra/storage/s3.storage.js'
import { AppError } from '#utils/AppError.js'
import { createChecksum } from '../media.utils.js'
import { mapCropToRegion } from './image.utils.js'
import  { type ImageCrop, ImageFormat } from './image.domain.js'
import type { ImageSettings } from './image.schema.js'

const SHARP_TO_IMAGE_FORMAT: Record<string, ImageFormat> = {
  jpeg: ImageFormat.JPEG,
  png: ImageFormat.PNG,
  webp: ImageFormat.WEBP,
  avif: ImageFormat.AVIF,
  gif: ImageFormat.GIF,
}

export const extractImageMetadata = async (key: string) => {
  const buffer = await getObjectBuffer(key)
  const checksum = createChecksum(buffer)
  const image = sharp(buffer, { failOnError: false })
  const originalMeta = await image.metadata()
  const normalizedMeta = await image.rotate().metadata()
  const { width, height } = normalizedMeta
  const { orientation } = originalMeta
  const sharpFormat = normalizedMeta.format
  const format = SHARP_TO_IMAGE_FORMAT[sharpFormat!]
  if (!format) throw new AppError(`Unsupported image format: ${sharpFormat}`)
  const details = { width, height, orientation: orientation ?? null, aspectRatio: width / height }
  
  return { checksum, format, size: buffer.length, details }
}

export const getDynamicImage = async (key: string, settings: ImageSettings) => {
  console.log(key)
  const source = await getObjectStream(key)
  const { w, h, fit, format, quality, crop } = settings
  if (crop) {
    const region = mapCropToRegion(crop as ImageCrop)
    const transform = sharp().rotate().extract(region).resize(w, h, { fit: fit }).toFormat(format, { quality })
    return source.pipe(transform)
  }
  const transform = sharp().rotate().resize(w, h, { fit: fit }).toFormat(format, { quality })
  return source.pipe(transform)
}
