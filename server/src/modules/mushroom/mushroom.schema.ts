import z from 'zod'
import { processNumber, uuidSchema } from '../../common/schemas/module.schema.js'

// CREATE
export const mushroomCreateSchema = z.object({
  kingdomId: uuidSchema,
  phylumId: uuidSchema,
  classId: uuidSchema,
  orderId: uuidSchema,
  familyId: uuidSchema,
  genusId: uuidSchema,
  speciesId: uuidSchema,
  latin: z.string().trim().min(1),
  cs: z.string().trim().transform(v => (v === "" ? null : v)).default(null),
  galleryIds: z.array(uuidSchema).default([])
}).strict()

// UPDATE
export const mushroomUpdateSchema = z.object({
  kingdomId: uuidSchema.optional(),
  phylumId: uuidSchema.optional(),
  classId: uuidSchema.optional(),
  orderId: uuidSchema.optional(),
  familyId: uuidSchema.optional(),
  genusId: uuidSchema.optional(),
  speciesId: uuidSchema.optional(),
  latin: z.string().trim().min(1).optional(),
  cs: z.string().trim().min(1).optional(),
  galleryIds: z.array(uuidSchema).optional()
}).strict()

// LIST
export const mushroomQuerySchema = z.object({
  ids: z.array(uuidSchema).optional(),
  phylumId: z.array(uuidSchema).optional(),
  classId: z.array(uuidSchema).optional(),
  orderId: z.array(uuidSchema).optional(),
  familyId: z.array(uuidSchema).optional(),
  genusId: z.array(uuidSchema).optional(),
  speciesId: z.array(uuidSchema).optional(),
  limit: z.preprocess(processNumber, z.number().positive()).optional().default(40),
  offset: z.preprocess(processNumber, z.number().nonnegative()).optional().default(0)
}).strict()

//TYPES
export type MushroomCreateInput = z.infer<typeof mushroomCreateSchema>
export type MushroomUpdateInput = z.infer<typeof mushroomUpdateSchema>
export type MushroomListQuery = z.infer<typeof mushroomQuerySchema>
