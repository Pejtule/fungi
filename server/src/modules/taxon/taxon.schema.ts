import z from 'zod'
import { processNumber, uuidSchema } from '../../common/schemas/module.schema.js'
import { ranks } from './taxon.domain.js'

export const latinSchema = z.string()
  .trim()
  .toLowerCase()
  .transform(v => v.replace(/\s+/g, ' ').normalize('NFC'))
  .pipe(z.string().regex(/^[a-z]+(?:[- ]?[a-z]+)*$/, "Latinský název obsahuje nepovolené znaky."))
  .transform(v => v.charAt(0).toUpperCase() + v.slice(1))

// CREATE
export const taxonCreateSchema = z.object({
  parentId: z.string().trim().transform(v => (v === "" ? null : v)).default(null).pipe(uuidSchema.nullable()),
  rank: z.string().trim().pipe(z.enum(ranks)),
  latin: latinSchema,
  cs: z.string().trim().transform(v => (v === "" ? null : v)).default(null)
}).strict()

// UPDATE
export const taxonUpdateSchema = z.object({
  parentId: z.string().trim().pipe(uuidSchema).optional(),
  latin: latinSchema.optional(),
  cs: z.string().trim().min(1).optional()
}).strict()

// LIST
export const taxonQuerySchema = z.object({
  parentId: z.array(z.string().trim().pipe(uuidSchema)).min(1).max(1).optional(),
  rank: z.array(z.string().trim().pipe(z.enum(ranks))).min(1).max(1).optional(),
  regex: z.array(z.string().trim().min(1)).min(1).max(1).optional(),
  ids: z.array(uuidSchema).min(1).optional(),
  limit: z.preprocess(processNumber, z.number().positive()).optional().default(20),
  offset: z.preprocess(processNumber, z.number().nonnegative()).optional().default(0)
}).strict()

// TYPES
export type TaxonCreateInput = z.infer<typeof taxonCreateSchema>
export type TaxonUpdateInput = z.infer<typeof taxonUpdateSchema>
export type TaxonListQuery = z.infer<typeof taxonQuerySchema>
