import z from 'zod'
import sharp from 'sharp'
import { ImageFormat } from './image.domain.js'
import { parseQueryCrop } from './image.utils.js'
import { processNumber, processNumberWithDefaultNull } from '../../../common/schemas/module.schema.js'

// DETAILS
export const imageDetailsSchema = z.object({
  width: z.preprocess(processNumber, z.number().positive()),
  height: z.preprocess(processNumber, z.number().positive()),
  aspectRatio: z.preprocess(processNumber, z.number().positive()),
  orientation: z.preprocess(processNumberWithDefaultNull, z.number().positive().nullable()),
}).strict()

// CROP
export const imageCropSchema = z.object({
  x: z.preprocess(processNumber, z.number().min(0)),
  y: z.preprocess(processNumber, z.number().min(0)),
  width: z.preprocess(processNumber, z.number().positive()),
  height: z.preprocess(processNumber, z.number().positive()),
}).strict()

// VARIANTS
export const imageVariantSchema = z.object({
  crop: imageCropSchema
}).strict()

export const imageVariantsSchema = z.object({
  square: imageVariantSchema.optional(),
  landscape: imageVariantSchema.optional(),
  portrait: imageVariantSchema.optional()
}).strict()

// IMAGE SETTINGS
export const ImageSettingsSchema = z.object({
  w: z.string().trim().default('800').transform(v => Number(v)).pipe(z.number().positive()),
  h: z.string().trim().default('600').transform(v => Number(v)).pipe(z.number().positive()),
  fit: z.string().trim().default(sharp.fit.cover).pipe(z.enum(Object.values(sharp.fit))),
  format: z.string().trim().default(ImageFormat.WEBP).pipe(z.enum(Object.values(ImageFormat))),
  quality: z.string().trim().default('80').transform(v => Number(v)).pipe(z.number().min(1).max(100)),
  crop: z.preprocess(parseQueryCrop, imageCropSchema.nullable()),
  version: z.preprocess(processNumber, z.number().positive()),
}).strict()

// TYPES
export type ImageSettings = z.infer<typeof ImageSettingsSchema>
