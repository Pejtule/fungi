import { createUuid } from '#infra/mongoose_orm/mongoose.helpers.js'
import type { Taxon, TaxonDTO } from './taxon.domain.js'
import type { TaxonCreateInput } from './taxon.schema.js'

export const toCreateDTO = (input: TaxonCreateInput, parent: Taxon | null) => {
  const { parentId, rank, latin, cs } = input
  const id = createUuid()
  const lineageIds = parent ? [...parent.lineageIds, id] : [id]

  return { id, lineageIds, parentId, rank, latin, cs }
}

export const toTaxonDTO = (t: Taxon): TaxonDTO => ({
  id: t.id,
  hasChildren: t.hasChildren,
  parentId: t.parentId,
  rank: t.rank,
  latin: t.latin,
  cs: t.cs
})
