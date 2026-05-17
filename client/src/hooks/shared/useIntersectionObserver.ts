import { useCallback } from 'react'

export function useIntersectionObserver(callback: () => void) {
  return useCallback((el: HTMLElement | null) => {
    if (!el) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) callback()
    })

    observer.observe(el)
    return () => observer.disconnect()
  }, [callback])
}
