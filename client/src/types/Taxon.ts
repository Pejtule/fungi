export interface Taxon {
  id: string
  parentId: string | null
  hasChildren: boolean
  lineageIds: string[]
  rank: TaxonRank
  latin: string
  cs: string
}

export type TaxonRank = 'species' | 'genus' | 'family' | 'order' | 'class' | 'phylum' | 'kingdom'
