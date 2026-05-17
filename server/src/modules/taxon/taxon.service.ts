import type { ClientSession } from 'mongoose'
import { withTransaction } from '#infra/mongoose_orm/mongoose.withTransaction.js'
import { AppError } from '#utils/AppError.js'
import type { TaxonCreateInput, TaxonUpdateInput, TaxonListQuery } from './taxon.schema.js'
import { type Taxon, TaxonRank } from './taxon.domain.js'
import { buildTaxonFilter, isRightParentRank } from './taxon.utils.js'
import * as taxonRepository from './taxon.repository.js'
import * as taxonMapper from './taxon.mapper.js'

//CREATE
export const create = async (input: TaxonCreateInput, session?: ClientSession) => {
  return withTransaction(async (s) => {
    const { parentId, rank, latin } = input

    if (rank !== TaxonRank.KINGDOM && !parentId) {
      throw new AppError("Taxon is not a root, it must have a parentId.", 422, 'Nejedná se o kořen, taxon musí mít parentId.')
    }

    if (rank === TaxonRank.KINGDOM && parentId) {
      throw new AppError("Root taxon cannot have a parent.", 422, 'Kořenový taxon nemůže mít rodiče.')
    }

    const existing = await findExisting({ rank, latin }, s)

    if (existing) {
      throw new AppError('Taxon is already exists.', 409, 'Tento taxon již v databázi existuje.', { existing })
    }

    const parent = parentId ? await findById(parentId, s) : null

    if (parentId && !parent) {
      throw new AppError('Parent taxon not found.', 404, 'Rodičovský taxon nebyl nalezen.')
    }
    
    if (parent && !isRightParentRank(rank, parent.rank)) {
      throw new AppError('Invalid parent rank.', 422, 'Rodič taxonu nemá správnou taxonomickou úroveň.')
    }

    const dto = taxonMapper.toCreateDTO(input, parent)
    const created = await taxonRepository.create(dto, s)

    if (!created) {
      throw new AppError(`Failed to create taxon record.`, 500)
    }

    if (parent && !parent.hasChildren) {
      await setHasChildren(parent.id, true, s)
    }

    return created

  }, session)
}

// LIST
export const list = async (query: TaxonListQuery, session?: ClientSession) => {
  const { limit, offset } = query
  const filter = buildTaxonFilter(query)
  const taxa = await taxonRepository.findMany( filter, { limit, offset }, session)
  const count = await taxonRepository.count(filter, session)
  const hasNextPage = offset + limit < count
  const hasPrevPage = offset > 0

  return {
    total: count,
    items: taxa,
    limit,
    offset,
    nextOffset: hasNextPage ? offset + limit : null,
    prevOffset: hasPrevPage ? Math.max(offset - limit, 0) : null,
    hasNextPage,
    hasPrevPage
  }
}

export const listByIds = async (ids: string[], session?: ClientSession) => {
  return await taxonRepository.findMany({ _id: { $in: ids } }, {}, session)
}

export const listByRank = async (rank: TaxonRank, session?: ClientSession) => {
  return await taxonRepository.findMany({ rank }, {}, session)
}

export const listByParentId = async (parentId: string | null, session?: ClientSession) => {
  return await taxonRepository.findMany({ parentId }, {}, session)
}

export const listByLatinRegex = async (regex: string,  session?: ClientSession) => {
  return await taxonRepository.findMany({ latin: { $regex: regex, $options: 'i' } }, {}, session)
}

// GET
export const get = async (id: string, session?: ClientSession) => {
  const taxon = await taxonRepository.getById(id, session)
  if (!taxon) throw new AppError('Taxon not found.', 404, 'Taxon nebyl nalezen.')
  return taxon
}

export const getChildCount = async (parentId: string, session?: ClientSession) => {
  return await taxonRepository.count({ parentId }, session)
}

// FIND
export const findById = async (id: string, session?: ClientSession) => {
  return await taxonRepository.getById(id, session)
}

export const findExisting = async (input: { rank: TaxonRank, latin: string }, session?: ClientSession) => {
  return await taxonRepository.findOne(input, session)
}

// UPDATE
export const update = async (id: string, input: TaxonUpdateInput, session?: ClientSession) => {
  return withTransaction(async (s) => {
    const original = await get(id, s)
    const parentChange = input.parentId && input.parentId !== original.parentId
    const parent = input.parentId && parentChange ? await findById(input.parentId, s) : null

    if (parentChange && original.rank === TaxonRank.KINGDOM) {
      throw new AppError("Root taxon cannot have a parent.", 422, 'Kořenový taxon nemůže mít rodiče.')
    }
    
    if (parentChange && !parent) {
      throw new AppError('Parent taxon not found.', 404, 'Rodičovský taxon nebyl nalezen.')
    }

    if (parent && !isRightParentRank(original.rank, parent.rank)) {
      throw new AppError('Invalid parent rank.', 422, 'Rodič taxonu nemá správný taxonomický stupeň.')
    }

    const { latin, cs, parentId } = input
    const lineageIds = parentChange && parent ? [...parent.lineageIds, original.id] : original.lineageIds
    const updateDTO = parentChange ? { latin, cs, parentId, lineageIds } : { latin, cs }
    const updated = await taxonRepository.update(id, updateDTO as Partial<Taxon>, s)

    if (!updated) {
      throw new AppError(`Failed to update taxon record.`, 500)
    }

    if (parent && !parent.hasChildren) {
      await setHasChildren(parent.id, true, s)
    }

    if (parentChange) {
      const childCount = await getChildCount(id)
      if (childCount > 0) {
        await propagateLineageDown(id, lineageIds, s)
      }
    }

    return updated

  }, session)
}

export const propagateLineageDown = async (parentId: string, parentLineage: string[], session?: ClientSession) => {
  const queue = [{ id: parentId, lineage: parentLineage }]

  while (queue.length > 0) {
    const { id, lineage } = queue.shift()!
    const children = await listByParentId(id, session)

    for (const child of children) {
      const childLineage = [...lineage, child.id]
      const updated = await taxonRepository.update(child.id, { lineageIds: childLineage }, session)

      if (!updated) {
        throw new AppError('Failed to update children lineageIds state.', 500)
      }

      queue.push({ id: child.id, lineage: childLineage })
    }
  }
}

export const setHasChildren = async (id: string, hasChildren: boolean, session?: ClientSession) => {
  const updated = await taxonRepository.update(id, { hasChildren }, session)

  if (!updated) {
    throw new AppError('Failed to update taxon hasChildren state.', 500)
  }

  return updated
}

// DELETE 
export const remove = async (id: string, session?: ClientSession) => {
  return withTransaction(async (s) => {
    const childCount = await getChildCount(id, s)

    if (childCount > 0) {
      throw new AppError('This taxon cannot be removed, because it has children.', 422, 'Tento taxon nemůže být odstraněn, protože má děti.')
    }

    const deleted = await taxonRepository.remove(id, s)

    if (!deleted) {
      throw new AppError('Removing taxa failed. Taxon not found.', 404, 'Taxon se nepodařilo smazat. Nebyl nalezen.')
    }

    let parentId = deleted.parentId

    while (parentId) {
      const parentChildCount = await getChildCount(parentId, s)

      if (parentChildCount === 0) {
        const deletedParent = await taxonRepository.remove(parentId, s)

        if (!deletedParent) {
          throw new AppError('Parent taxon not found during cleanup.', 500, 'Rodičovský taxon nebyl nalezen během mazání.')
        }

        parentId = deletedParent.parentId ?? null
      } else {
        parentId = null
        break
      }
    }

    return deleted

  }, session)
}
