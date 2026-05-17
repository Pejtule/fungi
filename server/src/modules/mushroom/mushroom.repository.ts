import type { ClientSession, QueryOptions, DeleteResult } from 'mongoose'
import { toDb } from '#infra/mongoose_orm/mongoose.helpers.js'
import { MushroomModel } from '#infra/mongoose_orm/mushroom.model.js'
import type { Mushroom } from './mushroom.domain.js'

// CREATE
export const create = async (dto: Partial<Mushroom>, session?: ClientSession): Promise<Mushroom> => {
  const [mushroom] = await MushroomModel.create([toDb(dto)], { session: session ?? null })
  return mushroom.toJSON()
}

// GET
export const getById = async (id: string, session?: ClientSession): Promise<Mushroom | null> => {
  const query = MushroomModel.findById(id)
  if (session) query.session(session)
  return await query.lean({ virtuals: true }).exec()
}

// FIND
export const findOne = async (filter: Record<string, unknown>, session?: ClientSession): Promise<Mushroom | null> => {
  const query = MushroomModel.findOne(filter)
  if (session) query.session(session)
  return await query.lean({ virtuals: true }).exec()
}

export const findMany = async (filter?: Record<string, unknown>, options?: QueryOptions, session?: ClientSession): Promise<Mushroom[]> => {
  const query = MushroomModel.find(filter ?? {}, null, options ?? {})
  if (session) query.session(session)
  return await query.lean({ virtuals: true }).exec()
}

// COUNT
export const count = async (filter?: Record<string, unknown>, session?: ClientSession): Promise<number> => {
  const query = MushroomModel.countDocuments(filter ?? {})
  if (session) query.session(session)
  return await query.exec()
}

// UPDATE
export const update = async (id: string, dto: Partial<Mushroom>, session?: ClientSession): Promise<Mushroom | null> => {
  let query = MushroomModel.findByIdAndUpdate(id, { $set: dto }, { new: true, runValidators: true, strict: 'throw' })
  if (session) query.session(session)
  return await query.lean({ virtuals: true }).exec()
}

// DELETE
export const remove = async (id: string, session?: ClientSession): Promise<DeleteResult> => {
  const query = MushroomModel.deleteOne({ _id: id })
  if (session) query.session(session)
  return await query.exec()
}
