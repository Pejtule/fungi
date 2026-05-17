import type { Media } from '../media.domain.js'
import type { ImageDetails, ImageVariantType, ImageVariant, ImageMediaDTO } from './image.domain.js'

export const toImageMediaDTO = (m: Media): ImageMediaDTO => {
  const details = isImageDetails(m.details) ? m.details : null
  const variants = isImageVariants(m.variants) ? m.variants : null

  return {
    id: m.id,
    status: m.status,
    version: m.version,
    type: m.type,
    key: m.key,
    checksum: m.checksum,
    originalName: m.originalName,
    storage: m.storage,
    mimetype: m.mimetype,
    format: m.format,
    size: m.size,

    width: details?.width,
    height: details?.height,
    aspectRatio: details?.aspectRatio,
    orientation: details?.orientation ?? null,

    squareCrop: variants?.square?.crop ?? null,
    landscapeCrop: variants?.landscape?.crop ?? null,
    portraitCrop: variants?.portrait?.crop ?? null,
  }
}

function isImageDetails(details: Media['details']): details is ImageDetails {
  return !!details && typeof (details as any).width === 'number'
}

function isImageVariants(
  variants: Media['variants']
): variants is Partial<Record<ImageVariantType, ImageVariant>> {
  return !!variants
}
