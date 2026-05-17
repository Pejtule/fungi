declare module 'photoswipe' {
  interface PreparedPhotoSwipeOptions {
    thumbBoundsFn?: (index: number) => { x: number; y: number; w: number } | null
  }
}
