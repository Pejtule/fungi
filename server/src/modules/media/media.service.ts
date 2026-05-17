import type { ClientSession } from 'mongoose'
import { AppError } from '#utils/AppError.js'
import type { MediaCreateInput, MediaUpdateInput, MediaListQuery } from './media.schema.js'
import type { Media } from './media.domain.js'
import * as mediaRepository from './media.repository.js'
import { buildMediaFilter } from './media.utils.js'

// CREATE
export const create = async (input: MediaCreateInput, session?: ClientSession) => {
  const media = await mediaRepository.create(input as Partial<Media>, session)
  if (!media) throw new AppError('Failed to create media record.', 500)
  return media
}

// LIST
export const list = async (query: MediaListQuery, session?: ClientSession) => {
  const { limit, offset } = query
  const filter = buildMediaFilter(query)
  const media = await mediaRepository.findMany(filter, { limit, offset }, session)
  const count = await mediaRepository.count(filter, session)
  const hasNextPage = offset + limit < count
  const hasPrevPage = offset > 0

  return {
    total: count,
    items: media,
    limit,
    offset,
    nextOffset: hasNextPage ? offset + limit : null,
    prevOffset: hasPrevPage ? Math.max(offset - limit, 0) : null,
    hasNextPage,
    hasPrevPage
  }
}

export const listByIds = async (ids: string[], session?: ClientSession) => {
  return await mediaRepository.findMany({ _id: { $in: ids } }, {}, session)
}

// GET
export const get = async (id: string, session?: ClientSession) => {
  const media = await mediaRepository.getById(id, session)
  if (!media) throw new AppError('Media not found.', 404, 'Záznam média nebyl nalezen.')
  return media
}

// FIND
export const findByChecksum = async (checksum: string, session?: ClientSession) => {
  return await mediaRepository.findOne({ checksum }, session)
}

export const findOrphansByIds = async (ids: string[], session?: ClientSession) => {
  return await mediaRepository.findMany({_id: { $nin: ids }}, {}, session)
}

// UPDATE
export const update = async (id: string, input: MediaUpdateInput, session?: ClientSession) => {
  const updated = await mediaRepository.update(id, input as Partial<Media>, session)
  if (!updated) throw new AppError('No changes applied.', 500)
  return updated
}

// DELETE
export const remove = async (id: string, session?: ClientSession) => {
  const result = await mediaRepository.removeOne(id, session)
  if (result.deletedCount !== 1) {
    throw new AppError('Removing media failed.', 500)
  }
}
