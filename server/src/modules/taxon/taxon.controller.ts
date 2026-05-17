import type { RequestHandler } from 'express'
import { asyncHandler } from '#utils/asyncHandler.js'
import { taxonCreateSchema, taxonUpdateSchema, taxonQuerySchema } from './taxon.schema.js'
import { uuidSchema } from '../../common/schemas/module.schema.js'
import * as taxonService from './taxon.service.js'

// CREATE
export const create: RequestHandler = asyncHandler(async (req, res) => {
  const input = taxonCreateSchema.parse(req.body)
  const created = await taxonService.create(input)
  return res.status(201).location(`/taxa/${created.id}`).json(created)
})


// LIST
export const list: RequestHandler = asyncHandler(async (req, res) => {
  const query = taxonQuerySchema.parse(req.normalizedQuery)
  const list = await taxonService.list(query)
  return res.status(200).json(list)
})

// GET
export const get: RequestHandler = asyncHandler(async (req, res) => {
  const id = uuidSchema.parse(req.params.id)
  const detail = await taxonService.get(id)
  return res.status(200).json(detail)
})

// UPDATE
export const update: RequestHandler = asyncHandler(async (req, res) => {
  const id = uuidSchema.parse(req.params.id)
  const input = taxonUpdateSchema.parse(req.body)
  const updated = await taxonService.update(id, input)
  return res.status(200).json(updated)
})

// DELETE
export const remove: RequestHandler = asyncHandler(async (req, res) => {
  const id = uuidSchema.parse(req.params.id)
  await taxonService.remove(id)
  return res.status(204).end()
})
