declare module 'fluent-ffmpeg' {
  export interface FfprobeStream {
    codec_type?: string
    codec_name?: string
    width?: number
    height?: number
    bit_rate?: string
  }

  export interface FfprobeFormat {
    format_name?: string
    duration?: string
    size?: string
    bit_rate?: string
  }

  export interface FfprobeData {
    streams: FfprobeStream[]
    format: FfprobeFormat
  }

  export interface FfmpegCommand {}

  const ffmpeg: {
    (input?: string): FfmpegCommand
    ffprobe: (path: string, callback: (err: Error | null, data: FfprobeData) => void) => void
    setFfprobePath: (path: string) => void
  }

  export default ffmpeg
}
