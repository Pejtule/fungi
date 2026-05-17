import type { RequestHandler } from 'express'
import { asyncHandler } from '#utils/asyncHandler.js'
import { formCreateSchema, formUpdateSchema, mushroomGetBySchema } from './api.mushroom.schema.js'
import { mushroomQuerySchema } from '#modules/mushroom/mushroom.schema.js'
import { uuidSchema } from '../../common/schemas/module.schema.js'
import * as apiMushroomService from './api.mushroom.service.js'

// CREATE
export const create: RequestHandler = asyncHandler(async (req, res) => {
  const input = formCreateSchema.parse(req.body)
  const created = await apiMushroomService.create(input)
  return res.status(201).location(`/api/mushrooms/${created.id}`).json(created)
})

// LIST
export const list: RequestHandler = asyncHandler(async (req, res) => {
  const query = mushroomQuerySchema.parse(req.normalizedQuery)
  const list = await apiMushroomService.list(query)
  return res.status(200).json(list)
})

// GET
export const get: RequestHandler = asyncHandler(async (req, res) => {
  const id = uuidSchema.parse(req.params.id)
  const { speciesId } = mushroomGetBySchema.parse(req.normalizedQuery)
  const detail = await apiMushroomService.get(id, speciesId ? speciesId[0] : false)
  return res.status(200).json(detail)
})

// UPDATE
export const update: RequestHandler = asyncHandler(async (req, res) => {
  const id = uuidSchema.parse(req.params.id)
  const input = formUpdateSchema.parse(req.body)
  const updated = await apiMushroomService.update(id, input)
  return res.status(200).json(updated)
})

// DELETE
export const remove: RequestHandler = asyncHandler(async (req, res) => {
  const id = uuidSchema.parse(req.params.id)
  await apiMushroomService.remove(id)
  return res.status(204).end()
})
