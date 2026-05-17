import { withTransaction } from '#infra/mongoose_orm/mongoose.withTransaction.js'
import { AppError } from '#utils/AppError.js'
import { toImageMediaDTO } from '#modules/media/image/image.mapper.js'
import { TaxonRank } from '#modules/taxon/taxon.domain.js'
import type { FormCreateInput, FormUpdateInput } from './api.mushroom.schema.js'
import type { TaxonUpdateInput } from '#modules/taxon/taxon.schema.js'
import type { MushroomListQuery } from '#modules/mushroom/mushroom.schema.js'
import * as apiMediaService from '../media/api.media.service.js'
import * as apiTaxonService from '../taxon/api.taxon.service.js'
import * as mediaService from '#modules/media/media.service.js'
import * as taxonService from '#modules/taxon/taxon.service.js'
import * as mushroomMediaService from '#modules/mushroom-media/mushroom-media.service.js'
import * as mushroomService from '#modules/mushroom/mushroom.service.js'
import * as apiMushroomMapper from './api.mushroom.mapper.js'

// CREATE
export const create = async (input: FormCreateInput) => {
  return withTransaction(async (session) => {
    const species = input.lineage.find((taxon) => taxon.rank === TaxonRank.SPECIES)
    if(!species) throw new AppError('Missing required species taxon in lineage.', 422, 'Chybí taxonomická data pro vytvoření druhu.')
    const lineage = await apiTaxonService.createLineage(input.lineage, session)
    const existing = await mushroomService.findBySpeciesId(lineage.speciesId, session)
    if (existing) throw new AppError('Mushroom is already exists.', 409, 'Tento druh již v databázi existuje.', { existing })
    const uploadedImageIds = [...new Set(input.galleryIds ?? [])]
    const gallery = await apiMediaService.finalizeUploads(uploadedImageIds, session)
    const galleryIds = gallery.map((image) => image.id)
    const mushroomCreateInput = apiMushroomMapper.toCreateInput(species, lineage, galleryIds)
    const mushroom = await mushroomService.create(mushroomCreateInput, session)
    await mushroomMediaService.link(mushroom.id, galleryIds, session)
    return apiMushroomMapper.toDetailDTO(mushroom, gallery.map(toImageMediaDTO))
  })
}

// LIST
export const list = async (query: MushroomListQuery) => {
  const { limit, offset } = query
  const { count, mushrooms } = await mushroomService.list(query)
  const items = await Promise.all(mushrooms.map(async (mushroom) => {
    const gallery = (await mediaService.listByIds(mushroom.galleryIds)).map(toImageMediaDTO)
    return apiMushroomMapper.toListDTO(mushroom, gallery)
  }))
  
  const hasNextPage = offset + limit < count
  const hasPrevPage = offset > 0

  return {
    total: count,
    items,
    limit,
    offset,
    nextOffset: hasNextPage ? offset + limit : null,
    prevOffset: hasPrevPage ? Math.max(offset - limit, 0) : null,
    hasNextPage,
    hasPrevPage
  }
}

// GET
export const get = async (id: string, speciesId: boolean) => {
  const mushroom = speciesId
    ? await mushroomService.findBySpeciesId(id)
    : await mushroomService.findByMushroomId(id)
  if (!mushroom) throw new AppError('Mushroom not found.', 404, 'Nebyl nalezen žádný odpovídající záznam.')
  const gallery = (await mediaService.listByIds(mushroom.galleryIds)).map(toImageMediaDTO)
  return apiMushroomMapper.toDetailDTO(mushroom, gallery)
}

// UPDATE
export const update = async (id: string, input: FormUpdateInput) => {
  return await withTransaction(async (session) => {
    const mushroom = await mushroomService.get(id, session)
    const lineage = input.lineage ? await apiTaxonService.updateLineage(mushroom.speciesId, input.lineage, session) : undefined

    const previousGalleryIds = mushroom.galleryIds
    const nextGalleryIds = [...new Set(input.galleryIds ?? [])]
    const idsToUnlink = previousGalleryIds.filter(prevId => !nextGalleryIds.includes(prevId))
    const idsToFinalize = nextGalleryIds.filter(nextId => !previousGalleryIds.includes(nextId))

    if (idsToUnlink.length) {
      await mushroomMediaService.unlink(id, idsToUnlink, session)
    }

    if (idsToFinalize.length) {
      await apiMediaService.finalizeUploads(idsToFinalize, session)
      await mushroomMediaService.link(id, idsToFinalize, session)
    }

    const speciesRecord = input.lineage ? input.lineage.find((record) => record.lineageId === mushroom.speciesId) : undefined
    const species = speciesRecord ? speciesRecord.data as TaxonUpdateInput : undefined
    const mushroomUpdateInput = apiMushroomMapper.toUpdateInput(species, lineage, nextGalleryIds)
    const updated = await mushroomService.update(id, mushroomUpdateInput, session)
    const gallery = (await mediaService.listByIds(updated.galleryIds)).map(toImageMediaDTO)
    return apiMushroomMapper.toDetailDTO(updated, gallery)
  })
}

// DELETE
export const remove = async (id: string) => {
  await withTransaction(async (session) => {
    const mushroom = await mushroomService.get(id, session)
    await taxonService.remove(mushroom.speciesId, session)
    await mushroomMediaService.unlink(mushroom.id, mushroom.galleryIds, session)
    await mushroomService.remove(id, session)
  })
}
