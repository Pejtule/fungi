import type { ClientSession } from 'mongoose'
import { AppError } from '#utils/AppError.js'
import { createUuid } from '#infra/mongoose_orm/mongoose.helpers.js'
import { createS3Key } from '#infra/storage/s3.helpers.js'
import { createUploadUrl } from '#infra/storage/s3.storage.js'
import { toImageMediaDTO } from '#modules/media/image/image.mapper.js'
import { getDynamicImage } from '#modules/media/image/image.processor.js'
import { buildImageUrl, getImageVariantType } from '#modules/media/image/image.utils.js'
import { extractMetadata, getAllowedFormats } from '#modules/media/media.utils.js'
import type { UploadInput } from './api.media.schema.js'
import type { ImageSettings } from '#modules/media/image/image.schema.js'
import type { ImageCrop } from '#modules/media/image/image.domain.js'
import { MediaType, StatusType, type MediaVariant, type MediaVariantKey } from '#modules/media/media.domain.js'
import { mediaCreateSchema, mediaUpdateSchema } from '#modules/media/media.schema.js'
import * as mediaService from '#modules/media/media.service.js'

// UPLOAD
export const upload = async (input: UploadInput) => {
  const { type, mimetype, originalName } = input
  const id = createUuid()
  const key = createS3Key({ type, id, originalName })
  const uploadUrl = await createUploadUrl(key, mimetype)
  const mediaCreateInput = mediaCreateSchema.parse({ id, key, ...input, storage: 's3' })
  const media = await mediaService.create(mediaCreateInput)
  const allowedFormats = getAllowedFormats(type)
  const previewUrl = type === MediaType.IMAGE ? buildImageUrl(id, 300, 300, media.version) : undefined

  return { uploadUrl, allowedFormats, expiresIn: 900, media, previewUrl }
}

export const finalizeUploads = async (uploadIds: string[], session?: ClientSession) => {
  const result = await Promise.all(uploadIds.map(async (id) => {
    const media = await mediaService.get(id, session)
    if (media.status === StatusType.FAILED) throw new AppError('Cannot finalize failed media.', 500)
    if (media.status === StatusType.READY) return media
    const meta = await extractMetadata(media.type, media.key)
    if(!meta) throw new AppError(`Metadata wasn't extracted.`, 500)
    const existing = await mediaService.findByChecksum(meta.checksum, session)
    if (existing && existing.status === StatusType.READY) return existing
    const mediaUpdateInput = mediaUpdateSchema.parse({ ...meta, status: StatusType.READY })
    return await mediaService.update(media.id, mediaUpdateInput, session)
  }))

  if (result.length !== uploadIds.length) throw new AppError('Failed finalize uploads', 500)
  
  return result
}

// DYNAMIC IMAGE
export const getImage = async (id: string, settings: ImageSettings) => {
  const media = await mediaService.get(id)
  if (media.type !== MediaType.IMAGE) throw new AppError('Found media is not type of image.', 422, 'Nalezený záznam není typu image.')
  const image = toImageMediaDTO(media)
  if (!settings.crop) {
    const key = getImageVariantType(settings.w, settings.h)
    const crop = image[`${key}Crop`]
    settings.crop = crop ?? null
  }
  const stream = await getDynamicImage(image.key + '.jpg', settings)
  return { stream, mimetype: image.mimetype }
}

// IMAGE CROP
export const addImageCrop = async (id: string, crop: ImageCrop) => {
  const media = await mediaService.get(id)
  if (media.type !== MediaType.IMAGE) throw new AppError('Found media is not type of image.', 422, 'Nalezený záznam není typu image.')
  const key = getImageVariantType(crop.width, crop.height)
  const variants = media.variants ?? {} as Partial<Record<MediaVariantKey, MediaVariant>>
  variants[key] = { crop }
  const mediaUpdateInput = mediaUpdateSchema.parse({ variants, version: media.version + 1 })
  return await mediaService.update(id, mediaUpdateInput)
}
