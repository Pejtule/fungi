import type { Taxon } from '../types/Taxon'

export function buildFilters(taxa: Taxon[]) {
  return taxa.reduce<Record<string, string[]>>((acc, taxon) => {
    const key = `${taxon.rank}Id`
    const prev = acc[key] ?? []
    const next = [...prev, taxon.id].sort()
    acc[key] = next

    return acc
  }, {})
}