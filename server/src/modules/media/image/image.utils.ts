import { API_URL } from '#config/env.js'
import { ImageVariantType, type ImageCrop } from './image.domain.js'

export const buildImageUrl = (id: string, width: number, height: number, version: number) => {
  return `${API_URL}/media/image/${id}?w=${width}&h=${height}&version=${version}`
}

export const parseQueryCrop = (value: string) => {
  if (!value) return null
  value.trim()
  if(value === '') return null
  const [x, y, width, height] = value.split(',').map(Number)

  if ([x, y, width, height].some(n => Number.isNaN(n))) {
    throw new Error('Invalid crop format.')
  }

  return { x, y, width, height }
}

export const mapCropToRegion = (crop: ImageCrop) => {
  return {
    left: crop.x,
    top: crop.y,
    width: crop.width,
    height: crop.height
  }
}

export const getImageVariantType = (width: number, height: number) => {
  if (width === height) {
    return ImageVariantType.SQUARE
  } else if (width > height) {
    return ImageVariantType.LANDSCAPE
  }
  return ImageVariantType.PORTRAIT
}
