import { mushroomCreateSchema, type MushroomCreateInput,
         mushroomUpdateSchema, type MushroomUpdateInput} from '#modules/mushroom/mushroom.schema.js'
import type { TaxonCreateInput, TaxonUpdateInput } from '#modules/taxon/taxon.schema.js'
import type { LineageRecord } from '../taxon/api.taxon.types.js'
import type { Mushroom } from '#modules/mushroom/mushroom.domain.js'
import type { ImageMediaDTO } from '#modules/media/image/image.domain.js'
import { buildImageUrl } from '#modules/media/image/image.utils.js'

// DTO
export const toListDTO = (m: Mushroom, images: ImageMediaDTO[]) => {
  const first = images[0]
  const thumbnail = first ? { ...toImageVariantDTO(first.id, 200, 200, first.version), alt: m.latin } : null

  return {
    id: m.id,
    latin: m.latin,
    cs: m.cs,
    thumbnail
  }
}

export const toDetailDTO = (m: Mushroom, images: ImageMediaDTO[]) => {
  const lineageIds = [m.kingdomId, m.phylumId, m.classId, m.orderId, m.familyId, m.genusId]
  const gallery = images.map((image) => toGalleryImageDTO(image.id, image.version, m.latin))

  return {
    id: m.id,
    speciesId: m.speciesId,
    lineageIds,
    latin: m.latin,
    cs: m.cs,
    gallery,
  }
}

const toGalleryImageDTO = (id: string, mediaVersion: number, alt: string) => {
  const full = toImageVariantDTO(id, 1200, 1200, mediaVersion)
  const medium = toImageVariantDTO(id, 800, 800, mediaVersion)
  const thumbnail = toImageVariantDTO(id, 300, 300, mediaVersion)
  return { id, full, medium, thumbnail, alt }
}

const toImageVariantDTO = (id: string, width: number, height: number, version: number) => {
  const url = buildImageUrl(id, width, height, version)
  return { url, width, height }
}

// INPUT
export const toCreateInput = (species: TaxonCreateInput, lineage: LineageRecord, galleryIds: string[]): MushroomCreateInput => {
  const mushroom = {
    ...lineage,
    latin: species?.latin,
    cs: species?.cs ?? null,
    galleryIds
  }

  return mushroomCreateSchema.parse(mushroom)
}

export const toUpdateInput = (species: TaxonUpdateInput | undefined, lineage: LineageRecord | undefined, galleryIds: string[]): MushroomUpdateInput => {
  const mushroom = {
    ...lineage,
    latin: species?.latin,
    cs: species?.cs,
    galleryIds
  }
  
  return mushroomUpdateSchema.parse(mushroom)
}
