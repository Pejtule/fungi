import type { ClientSession } from 'mongoose'
import { AppError } from '#utils/AppError.js'
import * as mushroomMediaRepository from './mushroom-media.repository.js'
import * as mushroomService from '../mushroom/mushroom.service.js'
import * as mediaService from '../media/media.service.js'
import { deleteObject } from '#infra/storage/s3.storage.js'

export const link = async (mushroomId: string, mediaIds: string[], session?: ClientSession) => {
  const dtos = mediaIds.map((mediaId) => ({ mushroomId, mediaId }))
  const result = await mushroomMediaRepository.insertMany(dtos, session)
  if (result.length !== mediaIds.length) {
    throw new AppError('Linking media to mushroom failed.', 500)
  }
}

export const unlink = async (mushroomId: string, mediaIds: string[], session?: ClientSession) => {
  const result = await mushroomMediaRepository.removeMany({ mushroomId, mediaId: { $in: mediaIds } }, session)
  await cleanupOrphanMedia(session)
}

export const getMediaIdsForMushroom = async (mushroomId: string, session?: ClientSession) => {
  const links = await mushroomMediaRepository.findMany({ mushroomId }, session)
  return links.map(link => link.mediaId)
}

export const getMediaForMushroom = async (mushroomId: string, session?: ClientSession) => {
  const ids = await getMediaIdsForMushroom(mushroomId, session)
  return await mediaService.listByIds(ids, session)
}

export const getMushroomIdsForMedia = async (mediaId: string, session?: ClientSession) => {
  const links = await mushroomMediaRepository.findMany({ mediaId }, session)
  return links.map(link => link.mushroomId)
}

export const getMushroomsForMedia = async (mediaId: string, session?: ClientSession) => {
  const ids = await getMushroomIdsForMedia(mediaId, session)
  return await mushroomService.listByIds(ids, session)
}

export const cleanupOrphanMedia = async (session?: ClientSession) => {
  const usedMediaIds = await mushroomMediaRepository.getDistinct('mediaId', session)
  const orphanMedia = await mediaService.findOrphansByIds(usedMediaIds, session)

  for (const media of orphanMedia) {
    try {
      await deleteObject(media.key)
      console.log(`S3: smazán objekt ${media.key}`)
    } catch (err) {
      console.error('Chyba při mazání z S3:', err)
    }

    await mediaService.remove(media.id, session)
    console.log(`MongoDB: smazán Media záznam ${media.id}`)
  }
}
