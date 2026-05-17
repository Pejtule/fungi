import { useState, useRef, useLayoutEffect } from 'react'
import { cn } from '../helpers/cn'

const ui = {
  container: 'relative inline-flex',
  tooltip: cn(
    'absolute z-50 px-2 py-1 rounded-md bg-zinc-900 dark:bg-zinc-50 shadow-lg',
    'text-zinc-100 dark:text-zinc-900 text-xs whitespace-nowrap',
    'transition-all duration-150 ease-out pointer-events-none'),
  right: 'right-0',
  left: 'left-0',
  visible: 'opacity-100 translate-y-0 scale-100',
  invisible: 'opacity-0 translate-y-1 scale-95'
}

type TooltipProps = {
  content: string
  children: React.ReactNode,
  position?: 'left' | 'right'
}

export const Tooltip = ({ content, children, position = 'right' }: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const [offset, setOffset] = useState(0)
  const ref = useRef<HTMLDivElement | null>(null)

  useLayoutEffect(() => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    setOffset(rect.height)
  }, [children])

  return (
    <div
      ref={ref}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      className={ui.container}
    >
      {children}

      <span
        className={cn(ui.tooltip, position === 'right' ? ui.right : ui.left, isVisible ? ui.visible : ui.invisible)}
        style={{top: offset + 8}}
        >
        {content}
      </span>
    </div>
  )
}
