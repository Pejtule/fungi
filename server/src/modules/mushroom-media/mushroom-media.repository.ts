import type { ClientSession, QueryOptions, DeleteResult } from 'mongoose'
import { MushroomMediaModel } from '#infra/mongoose_orm/mushroom-media.model.js'
import type { MushroomMedia } from './mushroom-media.domain.js'

// CREATE
export const insertMany = async (dtos: Partial<MushroomMedia>[], session?: ClientSession): Promise<MushroomMedia[]> => {
  return await MushroomMediaModel.insertMany(dtos, { session: session ?? null, ordered: true })
}

// FIND
export const findMany = async (filter?: Partial<MushroomMedia>, options?: QueryOptions, session?: ClientSession): Promise<MushroomMedia[]> => {
  const query = MushroomMediaModel.find(filter ?? {}, null, options ?? {})
  if (session) query.session(session)
  return await query.lean({ virtuals: true }).exec()
}

// DELETE
export const removeMany = async (filter: Record<string, unknown>, session?: ClientSession): Promise<void> => {
  const docs = await MushroomMediaModel.find(filter).lean()

  for (const doc of docs) {
    const query = MushroomMediaModel.findOneAndDelete({ _id: doc._id })
    if (session) query.session(session)
    await query.exec()
  }
}

// DISTINCT
export const getDistinct = async (key: string, session?: ClientSession): Promise<string[]> => {
  return MushroomMediaModel.distinct(key).session(session ?? null) as Promise<string[]>
}
