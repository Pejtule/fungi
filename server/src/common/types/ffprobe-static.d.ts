declare module 'ffprobe-static' {
  interface FFProbeStatic {
    path: string
    version: string
  }

  const ffprobe: FFProbeStatic
  export default ffprobe
}
