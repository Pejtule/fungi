export interface Taxon {
  id: string
  lineageIds: string[]
  hasChildren: boolean
  parentId: string | null
  rank: TaxonRank
  latin: string
  cs: string | null
  createdAt: Date
  updatedAt: Date
}

export interface TaxonDTO {
  id: string
  hasChildren: boolean
  parentId: string | null
  rank: TaxonRank
  latin: string
  cs: string | null
} 

export enum TaxonRank {
  KINGDOM = 'kingdom',
  PHYLUM = 'phylum',
  CLASS = 'class',
  ORDER = 'order',
  FAMILY = 'family',
  GENUS = 'genus',
  SPECIES = 'species'
}

export const ranks = Object.values(TaxonRank)

export const rankOrder: Record<TaxonRank, number> = {
  kingdom: 1,
  phylum: 2,
  class: 3,
  order: 4,
  family: 5,
  genus: 6,
  species: 7,
}
