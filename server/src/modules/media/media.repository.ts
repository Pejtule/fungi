import type { ClientSession, QueryOptions, DeleteResult } from 'mongoose'
import { toDb } from '#infra/mongoose_orm/mongoose.helpers.js'
import { MediaModel } from '#infra/mongoose_orm/media.model.js'
import type { Media } from './media.domain.js'

// CREATE
export const create = async (dto: Partial<Media>, session?: ClientSession): Promise<Media> => {
  const [media] = await MediaModel.create([toDb(dto)], { session: session ?? null })
  return media.toJSON()
}

// GET
export const getById = async (id: string, session?: ClientSession): Promise<Media | null> => {
  const query = MediaModel.findById(id)
  if (session) query.session(session)
  return await query.lean({ virtuals: true }).exec()
}

// FIND
export const findOne = async (filter: Record<string, unknown>, session?: ClientSession): Promise<Media | null> => {
  const query = MediaModel.findOne(filter)
  if (session) query.session(session)
  return await query.lean({ virtuals: true }).exec()
}

export const findMany = async (filter?: Record<string, unknown>, options?: QueryOptions, session?: ClientSession): Promise<Media[]> => {
  const query = MediaModel.find(filter ?? {}, null, options ?? {})
  if (session) query.session(session)
  return await query.lean({ virtuals: true }).exec()
}

// COUNT
export const count = async (filter?: Record<string, unknown>, session?: ClientSession): Promise<number> => {
  const query = MediaModel.countDocuments(filter ?? {})
  if (session) query.session(session)
  return await query.exec()
}

// UPDATE
export const update = async (id: string, dto: Partial<Media>, session?: ClientSession): Promise<Media | null> => {
  let query = MediaModel.findByIdAndUpdate(id, { $set: dto }, { new: true, runValidators: true, strict: 'throw' })
  if (session) query.session(session)
  return await query.lean({ virtuals: true }).exec()
}

// DELETE
export const removeOne = async (id: string, session?: ClientSession): Promise<DeleteResult> => {
  const query = MediaModel.deleteOne({ _id: id })
  if (session) query.session(session)
  return await query.exec()
}
