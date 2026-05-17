import type { ClientSession } from 'mongoose'
import { withTransaction } from '#infra/mongoose_orm/mongoose.withTransaction.js'
import { AppError } from '#utils/AppError.js'
import type { LineageUpdateInput } from './api.taxon.schema.js'
import { EditMode, type ResolveLatinResponse } from './api.taxon.types.js'
import { canonicalizeLatin, parseLatin, levenshtein } from './api.taxon.utils.js'
import { taxonCreateSchema, taxonUpdateSchema, taxonQuerySchema, type TaxonCreateInput, type TaxonUpdateInput } from '#modules/taxon/taxon.schema.js'
import { rankOrder, TaxonRank, type Taxon, type TaxonDTO } from '#modules/taxon/taxon.domain.js'
import { toTaxonDTO } from '#modules/taxon/taxon.mapper.js'
import * as taxonService from '#modules/taxon/taxon.service.js'

// RANK
export const rank = async (rank: TaxonRank) => {
  return await taxonService.listByRank(rank)
}

// CHILDREN
export const children = async (parentId: string | null) => { 
  return (await taxonService.listByParentId(parentId)).map(toTaxonDTO)
}

// RESOLVE
export const resolve = async (latin: string): Promise<ResolveLatinResponse> => {
  const canonicalLatin = canonicalizeLatin(latin)
  const parsed = parseLatin(canonicalLatin)

  if (!parsed.genus) {
    const families = (await taxonService.listByRank(TaxonRank.FAMILY)).map(toTaxonDTO)
    const missing = [TaxonRank.GENUS, TaxonRank.SPECIES]
    return mapToResponse({ canonicalLatin, parsed, missing, suggestions: { families } })
  }
  const genusQuery = taxonQuerySchema.parse({ regex: [`^${parsed.genus}$`], rank: [TaxonRank.GENUS] })
  const speciesQuery = taxonQuerySchema.parse({ regex: [`^${parsed.genus} ${parsed.species}$`], rank: [TaxonRank.SPECIES] })
  
  const genus = (await taxonService.list(genusQuery)).items[0]
  const species = parsed.species ? (await taxonService.list(speciesQuery)).items[0] : null

  if (species) {
    const lineageItems = await taxonService.listByIds(species.lineageIds)
    const lineage = Object.fromEntries(lineageItems.map((t) => [t.rank, toTaxonDTO(t)]))
    const fuzzy = { genusConfidence: 1, speciesConfidence: 1 } 
    return mapToResponse({ match: 'species', canonicalLatin, parsed, lineage, fuzzy })
  }

  if (genus) {
    const lineageItems = await taxonService.listByIds(genus.lineageIds)
    const lineage = Object.fromEntries(lineageItems.map((t) => [t.rank, toTaxonDTO(t)]))
    const missing = [TaxonRank.SPECIES]
    const fuzzy = { genusConfidence: 1, speciesConfidence: 0 }
    return mapToResponse({ match: 'genus', canonicalLatin, parsed, lineage, missing, fuzzy })
  }

  const genusItems = (await taxonService.listByRank(TaxonRank.GENUS)).map(toTaxonDTO)
  const fuzzyGenera = getFuzzyGenera(parsed.genus, genusItems)
  const genusConfidence = fuzzyGenera[0]?.confidence ?? 0
  const familyQuery = taxonQuerySchema.parse({ regex: [`^${parsed.genus[0]}`], rank: [TaxonRank.FAMILY] })
  const families = (await taxonService.list(familyQuery)).items.map(toTaxonDTO)
  const genera = fuzzyGenera.map(g => g.taxon)
  const suggestions = { families, genera }
  const fuzzy = { genusConfidence, corrections: { genus: genera } }
  return mapToResponse({canonicalLatin, parsed, missing: [TaxonRank.GENUS, TaxonRank.SPECIES], suggestions, fuzzy })
}

export const getFuzzyGenera = (genus: string, genusItems: TaxonDTO[]) => {
  return genusItems.map((g) => {
    const distance = levenshtein(genus.toLowerCase(), g.latin.toLowerCase())
    const confidence = 1 - distance / Math.max(genus.length, g.latin.length)
    return { taxon: g, confidence }
  }).filter(x => x.confidence > 0.3).sort((a, b) => b.confidence - a.confidence)
}

export const mapToResponse = (res: Partial<ResolveLatinResponse>): ResolveLatinResponse => {
  return {
    match: res.match ?? 'none',
    canonicalLatin: res.canonicalLatin,
    parsed: res.parsed,
    lineage: res.lineage ?? {},
    missing: res.missing ?? [],
    suggestions: res.suggestions ?? {},
    fuzzy: res.fuzzy ?? {}
  } as ResolveLatinResponse
}

// CREATE
export const createLineage = async (inputs: TaxonCreateInput[], session?: ClientSession) => {
  inputs.sort((a, b) => rankOrder[a.rank] - rankOrder[b.rank])
  validateRankConsistency(inputs)

  let parentId: string | null = null
  let lastCreated: Taxon | null = null

  for (const input of inputs) {
    if (!input.parentId && parentId) {
      input.parentId = parentId
    }
    if (input.parentId !== parentId) {
      throw new AppError(
        'Inconsistent parentId: the value does not match the id of the parent taxon.',
        422,
        'Nekonzistentní parentId: hodnota neodpovídá id rodičovského taxonu.')
    }

    const { rank, latin } = input
    const existing = await taxonService.findExisting({ rank, latin }, session)

    if (existing) {
      parentId = existing.id
      lastCreated = existing
      continue
    }
    
    let created = await taxonService.create(input, session)
    parentId = created.id
    lastCreated = created
  }
  
  if (!lastCreated) {
    throw new AppError("Failed to create lineage.", 500)
  }
  const lineageTaxa = await taxonService.listByIds(lastCreated.lineageIds, session)
  return buildLineageRecord(lineageTaxa)
}

export const buildLineageRecord = (taxa: Taxon[]) => {
  const mapped = taxa.map((t) => [`${t.rank}Id`, t.id])
  return Object.fromEntries(mapped)

}

export const validateRankConsistency = (inputs: TaxonCreateInput[]) => {
  for (let i = 1; i < inputs.length; i++) {
    const prev = inputs[i - 1]
    const curr = inputs[i]

    const expectedPrevRankOrder = rankOrder[curr.rank] - 1
    const actualPrevRankOrder = rankOrder[prev.rank]

    if (actualPrevRankOrder !== expectedPrevRankOrder) {
      throw new AppError(`Invalid lineage: missing rank between ${prev.rank} and ${curr.rank}.`, 422, 'Chybějící taxonomická úroveň.')
    }
  }
}

// UPDATE
export const updateLineage = async (id: string, inputs: LineageUpdateInput[], session?: ClientSession) => {
  return withTransaction(async (s) => {
    const taxon = await taxonService.get(id, s)

    let parentId: string | null = null
    const replacedTaxaIds: string[] = []

    for (const lineageId of taxon.lineageIds) {
      const change = inputs.find((input) => input.lineageId === lineageId)

      if (!change) {
        if (parentId) {
          const updateInput = taxonUpdateSchema.parse({ parentId })
          await taxonService.update(lineageId, updateInput, s)
        }
        parentId = lineageId
        continue
      }

      if (change.mode === EditMode.REPLACE && !change.replaceId) {
        replacedTaxaIds.push(lineageId)
        const createInput = taxonCreateSchema.parse({ ...change.data, parentId })
        const created = await taxonService.create(createInput, s)
        parentId = created.id
        continue
      }

      const { latin, cs } = change.data as TaxonUpdateInput
      const updateInput = taxonUpdateSchema.parse( parentId ? { latin, cs, parentId } : { latin, cs })
      
      if (change.mode === EditMode.REPLACE && change.replaceId) {
        replacedTaxaIds.push(lineageId)
        if(updateInput) await taxonService.update(change.replaceId, updateInput, s)
        parentId = change.replaceId
        continue
      }

      if(updateInput) await taxonService.update(lineageId, updateInput, s)
      parentId = lineageId
    }

    if (replacedTaxaIds.length > 0) {
      const lowestReplaced = replacedTaxaIds[replacedTaxaIds.length - 1]
      await taxonService.remove(lowestReplaced, s)
    }

    if (!parentId) {
      throw new AppError('Failed to update lineage.', 500)
    }

    const parent = await taxonService.get(parentId, s)
    const newLineage = parent ? parent.lineageIds : []
    const childCount = await taxonService.getChildCount(parentId)

    if (childCount > 0) {
      await taxonService.propagateLineageDown(id, newLineage, s)
    }

    const lineageTaxa = await taxonService.listByIds(newLineage, session)
    return buildLineageRecord(lineageTaxa)

  }, session)
}
