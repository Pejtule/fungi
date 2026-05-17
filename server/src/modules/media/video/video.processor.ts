import ffprobeStatic from 'ffprobe-static'
import ffmpeg, { type FfprobeData, type FfprobeStream } from 'fluent-ffmpeg'
import fs from 'fs/promises'
import path from 'path'
import { getObjectBuffer } from '#infra/storage/s3.storage.js'
import { createChecksum } from '../media.utils.js'
import { VideoFormat } from './video.domain.js'

export const extractVideoMetadata = async (key: string) => {
  const buffer = await getObjectBuffer(key)
  const checksum = createChecksum(buffer)
  const tempPath = path.join('/tmp', `${checksum}.tmp`)
  await fs.writeFile(tempPath, buffer)
  ffmpeg.setFfprobePath(ffprobeStatic.path)
  const info: FfprobeData = await new Promise((resolve, reject) => {
    ffmpeg.ffprobe(tempPath, (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  })
  await fs.unlink(tempPath)
  const videoStream: FfprobeStream | undefined = info.streams.find((s) => s.codec_type === 'video')

  return {
    checksum,
    format: normalizeVideoFormat(info.format.format_name ?? ''),
    size: Number(info.format.size),
    details: {
      duration: Number(info.format.duration),
      width: videoStream?.width ?? null,
      height: videoStream?.height ?? null,
      codec: videoStream?.codec_name ?? null,
      bitrate: Number(info.format.bit_rate) || null,
    }
  }
}

export const normalizeVideoFormat = (raw: string): VideoFormat => {
  if (!raw) return VideoFormat.MP4
  const primary = raw.split(',')[0].trim().toLowerCase()

  switch (primary) {
    case 'mp4':
    case 'm4v':
    case 'm4a':
      return VideoFormat.MP4
    case 'mov':
      return VideoFormat.MOV
    case 'webm':
      return VideoFormat.WEBM
    case 'mkv':
    case 'matroska':
      return VideoFormat.MKV
    default:
      return VideoFormat.MP4
  }
}
