import z from 'zod'
import { processNumber } from '../../common/schemas/module.schema.js'
import { types, mimetypes } from '#modules/media/media.domain.js'

// UPLOAD
export const uploadSchema = z.object({
  type: z.string().trim().pipe(z.enum(types)),
  mimetype: z.string().trim().pipe(z.enum(mimetypes)),
  originalName: z.string().trim().min(1),
  size: z.preprocess(processNumber, z.number().nonnegative()).optional(),
}).strict()

// TYPES
export type UploadInput = z.infer<typeof uploadSchema>
