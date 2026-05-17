import { first } from '#utils/utils.js'
import { TaxonRank, rankOrder } from './taxon.domain.js'
import type { TaxonListQuery } from './taxon.schema.js'

export const isRightParentRank = (childRank: TaxonRank, parentRank: TaxonRank) => {
  const childOrder = rankOrder[childRank]
  const parentOrder = rankOrder[parentRank]

  return parentOrder === childOrder - 1
}

export const buildTaxonFilter = (query: TaxonListQuery) => {
  const rank = first(query.rank)
  const regex = first(query.regex)
  const parentId = first(query.parentId)
  const ids = query.ids ?? undefined

  const filter: Record<string, unknown> = {}

  if (rank) {
    filter.rank = rank
  }

  if (regex) {
    filter.latin = { $regex: regex, $options: 'i' }
  }

  if (parentId) {
    filter.parentId = parentId
  }

  if (ids) {
    filter._id = { $in: ids }
  }

  return filter
}
