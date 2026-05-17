import type { Media } from '../media.domain.js'
import type { VideoMediaDTO } from './video.domain.js'


export const toVideoMediaDTO = (m: Media): VideoMediaDTO => {
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
  }
}
