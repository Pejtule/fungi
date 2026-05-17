import type { ClientSession } from 'mongoose'
import { AppError } from '#utils/AppError.js'
import { buildMushroomFilter } from './mushroom.utils.js'
import type { MushroomCreateInput, MushroomUpdateInput, MushroomListQuery } from './mushroom.schema.js'
import type { Mushroom } from './mushroom.domain.js'
import * as mushroomRepository from './mushroom.repository.js'

//CREATE
export const create = async (input: MushroomCreateInput, session?: ClientSession) => {
  const mushroom = await mushroomRepository.create(input as Partial<Mushroom>, session)
  if (!mushroom) throw new AppError('Failed to create mushroom record.', 500)
  return mushroom
}

// LIST
export const list = async (query: MushroomListQuery, session?: ClientSession) => {
  const { limit, offset, ...rawFilters } = query
  const filter = buildMushroomFilter(rawFilters)
  const mushrooms = await mushroomRepository.findMany(filter, { limit, skip: offset }, session)
  const count = await mushroomRepository.count(filter, session)
  return { count, mushrooms }
}

export const listByIds = async (ids: string[], session?: ClientSession) => {
  return await mushroomRepository.findMany({ _id: { $in: ids } }, {}, session)
}

// GET
export const get = async (id: string, session?: ClientSession) => {
  const mushroom = await mushroomRepository.getById(id, session)
  if (!mushroom) throw new AppError('Mushroom not found.', 404)
  return mushroom
}

export const findByMushroomId = async (id: string, session?: ClientSession) => {
  return await mushroomRepository.getById(id, session)
}

export const findBySpeciesId = async (id: string, session?: ClientSession) => {
  return await mushroomRepository.findOne({ speciesId: id}, session)
}

// UPDATE
export const update = async (id: string, input: MushroomUpdateInput, session?: ClientSession) => {
  const updated = await mushroomRepository.update(id, input as Partial<Mushroom>, session)
  if (!updated) throw new AppError('No changes applied.', 500)
  return updated
}

// DELETE
export const remove = async (id: string, session?: ClientSession) => {
  const result = await mushroomRepository.remove(id, session)
  if (result.deletedCount !== 1) {
    throw new AppError('Removing mushroom failed.', 500)
  }
}
