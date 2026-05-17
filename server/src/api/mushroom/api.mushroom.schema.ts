import z from 'zod'
import { taxonCreateSchema } from '#modules/taxon/taxon.schema.js'
import { lineageTaxonUpdateSchema } from '../taxon/api.taxon.schema.js'
import { uuidSchema } from '../../common/schemas/module.schema.js'

// CREATE
export const formCreateSchema = z.object({
  lineage: z.array(taxonCreateSchema),
  galleryIds: z.array(uuidSchema).default([])
}).strict()

// UPDATE
export const formUpdateSchema = z.object({
  lineage: z.array(lineageTaxonUpdateSchema).optional(),
  galleryIds: z.array(uuidSchema).optional()
}).strict()

// GET BY
export const mushroomGetBySchema = z.object({
  speciesId: z.array(z.boolean()).min(1).max(1).optional()
})

// TYPES
export type FormCreateInput = z.infer<typeof formCreateSchema>
export type FormUpdateInput = z.infer<typeof formUpdateSchema>
