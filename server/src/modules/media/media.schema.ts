import z from 'zod'
import { statuses, storages, types, mimetypes, formats } from './media.domain.js'
import { processNumber, uuidSchema } from '../../common/schemas/module.schema.js'
import { imageDetailsSchema, imageVariantsSchema } from './image/image.schema.js'
import { videoDetailsSchema, videoVariantsSchema } from './video/video.schema.js'

// CREATE
export const mediaCreateSchema = z.object({
  id: uuidSchema.optional(),
  storage: z.string().trim().pipe(z.enum(storages)),
  key: z.string().trim().min(1),
  checksum: z.string().trim().min(1).optional(),
  originalName: z.string().trim().min(1),
  type: z.string().trim().pipe(z.enum(types)),
  mimetype: z.string().trim().pipe(z.enum(mimetypes)),
  format: z.string().trim().pipe(z.enum(formats)).optional(),
  size: z.preprocess(processNumber, z.number().nonnegative()).optional(),
  details: z.union([imageDetailsSchema, videoDetailsSchema]).optional(),
  variants: z.union([imageVariantsSchema, videoVariantsSchema]).optional()
}).strict()

// UPDATE
export const mediaUpdateSchema = z.object({
  version: z.preprocess(processNumber, z.number().positive()).optional(),
  status: z.string().trim().pipe(z.enum(statuses)).optional(),
  storage: z.string().trim().pipe(z.enum(storages)).optional(),
  key: z.string().trim().min(1).optional(),
  checksum: z.string().trim().min(1).optional(),
  originalName: z.string().trim().min(1).optional(),
  type: z.string().trim().pipe(z.enum(types)).optional(),
  mimetype: z.string().trim().pipe(z.enum(mimetypes)).optional(),
  format: z.string().trim().pipe(z.enum(formats)).optional(),
  size: z.preprocess(processNumber, z.number().nonnegative()).optional(),
  details: z.union([imageDetailsSchema, videoDetailsSchema]).optional(),
  variants: z.union([imageVariantsSchema, videoVariantsSchema]).optional()
}).strict()

// LIST
export const mediaQuerySchema = z.object({
  ids: z.array(uuidSchema).optional(),
  limit: z.preprocess(processNumber, z.number().positive()).optional().default(20),
  offset: z.preprocess(processNumber, z.number().nonnegative()).optional().default(0)
}).strict()

// TYPES
export type MediaCreateInput = z.infer<typeof mediaCreateSchema>
export type MediaUpdateInput = z.infer<typeof mediaUpdateSchema>
export type MediaListQuery = z.infer<typeof mediaQuerySchema>
