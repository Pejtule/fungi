import z from 'zod'
import { taxonCreateSchema, taxonUpdateSchema } from '#modules/taxon/taxon.schema.js'
import { uuidSchema } from '../../common/schemas/module.schema.js'
import { editModes } from './api.taxon.types.js'

export const lineageTaxonUpdateSchema = z.object({
  lineageId: uuidSchema,
  mode: z.string().trim().pipe(z.enum(editModes)),
  replaceId: uuidSchema.optional(),
  data: z.union([taxonUpdateSchema, taxonCreateSchema]).optional()
})

export type LineageUpdateInput = z.infer<typeof lineageTaxonUpdateSchema>
