import { useRef, useState, useLayoutEffect } from 'react'

export function useElementWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [width, setWidth] = useState(0)

  useLayoutEffect(() => {
    if (!ref.current) return

    const update = () => {
      setWidth(ref.current!.getBoundingClientRect().width)
    }
    update()

    const observer = new ResizeObserver(update)
    observer.observe(ref.current)

    return () => observer.disconnect()
  }, [])

  return { ref, width }
}
