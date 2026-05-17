import type { TaxonDTO, TaxonRank } from '#modules/taxon/taxon.domain.js'

export type LineageRecord = Record<`${TaxonRank}Id`, string>

export type ResolveMatchType = 'species' | 'genus' | 'none'

export interface ResolveLatinResponse {
  match: ResolveMatchType
  canonicalLatin: string
  parsed: {
    genus?: string | undefined
    species?: string | undefined
    rest?: string[]
  }
  lineage: Partial<Record<TaxonRank, TaxonDTO>>
  missing: TaxonRank[]
  suggestions: {
    species?: TaxonDTO[]
    genera?: TaxonDTO[]
    families?: TaxonDTO[]
  }
  fuzzy?: {
    genusConfidence?: number
    speciesConfidence?: number
    corrections?: {
      genus?: TaxonDTO[]
      species?: TaxonDTO[]
    }
  }
}

export enum EditMode {
  UPDATE = 'update',
  REPLACE = 'replace',
}

export const editModes = Object.values(EditMode)
