import type { QueryOptions, ClientSession, DeleteResult } from 'mongoose'
import type { Taxon } from './taxon.domain.js'
import { TaxonModel } from '#infra/mongoose_orm/taxon.model.js'
import { toDb } from '#infra/mongoose_orm/mongoose.helpers.js'

// CREATE
export const create = async (dto: Partial<Taxon>, session?: ClientSession): Promise<Taxon> => {
  const [taxon] = await TaxonModel.create([toDb(dto)], { session: session ?? null })
  return taxon.toJSON()
}

// GET
export const getById = async (id: string, session?: ClientSession): Promise<Taxon | null> => {
  const query = TaxonModel.findById(id)
  if (session) query.session(session)
  return await query.lean({ virtuals: true }).exec()
}

// FIND
export const findOne = async (filter: Record<string, unknown>, session?: ClientSession): Promise<Taxon | null> => {
  const query = TaxonModel.findOne(filter)
  if (session) query.session(session)
  return await query.lean({ virtuals: true }).exec()
}

export const findMany = async (filter?: Record<string, unknown>, options?: QueryOptions, session?: ClientSession): Promise<Taxon[]> => {
  const query = TaxonModel.find(filter ?? {}, null, options ?? {})
  if (session) query.session(session)
  return await query.lean({ virtuals: true }).exec()
}

// COUNT
export const count = async (filter?: Record<string, unknown>, session?: ClientSession): Promise<number> => {
  const query = TaxonModel.countDocuments(filter ?? {})
  if (session) query.session(session)
  return await query.exec()
}

// UPDATE
export const update = async (id: string, dto: Partial<Taxon>, session?: ClientSession): Promise<Taxon | null> => {
  let query = TaxonModel.findByIdAndUpdate(id, { $set: dto }, { new: true, runValidators: true, strict: 'throw' })
  if (session) query.session(session)
  return await query.lean({ virtuals: true }).exec()
}

// DELETE
export const remove = async (id: string, session?: ClientSession): Promise<Taxon | null> => {
  const query = TaxonModel.findByIdAndDelete({ _id: id })
  if (session) query.session(session)
  return await query.lean({ virtuals: true }).exec()
}

export const removeMany = async (filter: Record<string, unknown>, session?: ClientSession): Promise<DeleteResult> => {
  const query = TaxonModel.deleteMany(filter)
  if (session) query.session(session)
  return await query.exec()
}
