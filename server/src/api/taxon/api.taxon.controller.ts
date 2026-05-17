import type { RequestHandler } from 'express'
import { asyncHandler } from '#utils/asyncHandler.js'
import { AppError } from '#utils/AppError.js'
import { taxonQuerySchema } from '#modules/taxon/taxon.schema.js'
import * as apiTaxonService from './api.taxon.service.js'

// RANK
export const rank: RequestHandler = asyncHandler(async (req, res) => {
  const { rank } = taxonQuerySchema.parse(req.normalizedQuery)
  if(!rank) throw new AppError('Not Found. Missing rank type.', 404)
  const list = await apiTaxonService.rank(rank[0])
  return res.status(200).json(list)
})

// CHILDREN
export const children: RequestHandler = asyncHandler(async (req, res) => {
  const { parentId } = taxonQuerySchema.parse(req.normalizedQuery)
  const id = parentId ? parentId[0] : null
  const children = await apiTaxonService.children(id)
  return res.status(200).json(children)
})

// RESOLVE
export const resolve: RequestHandler = asyncHandler(async (req, res) => {
  const { regex } = taxonQuerySchema.parse(req.normalizedQuery)
  const resolved = await apiTaxonService.resolve(regex ? regex[0] : '')
  return res.status(200).json(resolved)
})
