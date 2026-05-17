import { useEffect, useState } from 'react'

export function useDeviceCapabilities() {
  const isHoverable = useHoverCapability()
  const pointer = usePointerType()
  const isTouch = useTouch()
  const usingKeyboard = useKeyboardNavigation()
  const reducedMotion = useReducedMotion()
  const isLandscape = useLandscape()
  const isHybrid = isHoverable && isTouch

  return {
    isHoverable,
    pointer,
    isTouch,
    usingKeyboard,
    reducedMotion,
    isHybrid,
    isLandscape,
    isDesktop: pointer === 'fine' && isHoverable && !isTouch,
    isMobile: pointer === 'coarse' && isTouch && !isHoverable,
  }
}

export function useHoverCapability() {
  const [hoverable, setHoverable] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover)')
    setHoverable(mq.matches)

    const handler = (e: MediaQueryListEvent) => setHoverable(e.matches)
    mq.addEventListener('change', handler)

    return () => mq.removeEventListener('change', handler)
  }, [])

  return hoverable
}

export function usePointerType() {
  const [pointer, setPointer] = useState<'fine' | 'coarse' | 'none'>('none')

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)')
    const coarse = window.matchMedia('(pointer: coarse)')

    const update = () => {
      if (fine.matches) setPointer('fine')
      else if (coarse.matches) setPointer('coarse')
      else setPointer('none')
    }

    update()

    fine.addEventListener('change', update)
    coarse.addEventListener('change', update)

    return () => {
      fine.removeEventListener('change', update)
      coarse.removeEventListener('change', update)
    }
  }, [])

  return pointer
}

export function useTouch() {
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(hover: none) and (pointer: coarse)')
    setIsTouch(mq.matches)

    const handler = (e: MediaQueryListEvent) => setIsTouch(e.matches)
    mq.addEventListener('change', handler)

    return () => mq.removeEventListener('change', handler)
  }, [])

  return isTouch
}

export function useKeyboardNavigation() {
  const [usingKeyboard, setUsingKeyboard] = useState(false)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') setUsingKeyboard(true)
    }
    const handleMouse = () => setUsingKeyboard(false)

    window.addEventListener('keydown', handleKey)
    window.addEventListener('mousedown', handleMouse)

    return () => {
      window.removeEventListener('keydown', handleKey)
      window.removeEventListener('mousedown', handleMouse)
    }
  }, [])

  return usingKeyboard
}

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)

    const handler = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', handler)

    return () => mq.removeEventListener('change', handler)
  }, [])

  return reduced
}


export function useLandscape() {
  const [isLandscape, setIsLandscape] = useState(false)

  useEffect(() => {
    const check = () => {
      const orientationLandscape = window.matchMedia(
        '(orientation: landscape)',
      ).matches
      const lowHeight = window.innerHeight < 500

      setIsLandscape(orientationLandscape || lowHeight)
    }

    check()
    window.addEventListener('resize', check)
    window.addEventListener('orientationchange', check)

    return () => {
      window.removeEventListener('resize', check)
      window.removeEventListener('orientationchange', check)
    }
  }, [])

  return isLandscape
}
