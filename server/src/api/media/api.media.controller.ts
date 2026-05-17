import type { RequestHandler } from 'express'
import { asyncHandler } from '#utils/asyncHandler.js'
import { uploadSchema } from './api.media.schema.js'
import { ImageSettingsSchema, imageCropSchema } from '#modules/media/image/image.schema.js'
import { uuidSchema } from '../../common/schemas/module.schema.js'
import * as apiMediaService from './api.media.service.js'
import type { ImageCrop } from '#modules/media/image/image.domain.js'

// UPLOAD
export const upload: RequestHandler = asyncHandler(async (req, res) => {
  const input = uploadSchema.parse(req.body)
  const result = await apiMediaService.upload(input)
  res.status(201).location(`/media/${result.media.id}`).json(result)
})

// DYNAMIC IMAGE
export const getImage: RequestHandler = asyncHandler(async (req, res) => {
  const id = uuidSchema.parse(req.params.id)
  const imageSettings = ImageSettingsSchema.parse(req.query)
  const { stream, mimetype } = await apiMediaService.getImage(id, imageSettings)
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable').type(mimetype).status(200)
  return stream.pipe(res)
})

// IMAGE CROP
export const addImageCrop: RequestHandler = asyncHandler(async (req, res) => {
  const id = uuidSchema.parse(req.params.id)
  const crop = imageCropSchema.parse(req.body)
  if (!crop.x || !crop.y || !crop.width || !crop.height) {
  throw new Error("Invalid crop")
}
  const updated = await apiMediaService.addImageCrop(id, crop as ImageCrop)
  return res.status(200).json(updated)
})
