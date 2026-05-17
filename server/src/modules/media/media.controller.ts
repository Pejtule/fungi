import type { RequestHandler } from 'express'
import { asyncHandler } from '#utils/asyncHandler.js'
import { mediaCreateSchema, mediaUpdateSchema, mediaQuerySchema } from './media.schema.js'
import { uuidSchema } from '../../common/schemas/module.schema.js'
import * as mediaService from './media.service.js'

// CREATE
export const create: RequestHandler = asyncHandler(async (req, res) => {
  const input = mediaCreateSchema.parse(req.body)
  const created = await mediaService.create(input)
  return res.status(201).location(`/media/${created.id}`).json(created)
})

// LIST
export const list: RequestHandler = asyncHandler(async (req, res) => {
  const query = mediaQuerySchema.parse(req.normalizedQuery)
  const list = await mediaService.list(query)
  return res.status(200).json(list)
})

// GET
export const get: RequestHandler = asyncHandler(async (req, res) => {
  const id = uuidSchema.parse(req.params.id)
  const detail = await mediaService.get(id)
  return res.status(200).json(detail)
})

// UPDATE
export const update: RequestHandler = asyncHandler(async (req, res) => {
  const id = uuidSchema.parse(req.params.id)
  const input = mediaUpdateSchema.parse(req.body)
  const updated = await mediaService.update(id, input)
  return res.status(200).json(updated)
})

// DELETE
export const remove: RequestHandler = asyncHandler(async (req, res) => {
  const id = uuidSchema.parse(req.params.id)
  await mediaService.remove(id)
  return res.status(204).end()
})
