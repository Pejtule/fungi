import { useEffect } from 'react'

const ui = {
  overlay: 'fixed inset-0 z-50 w-screen overflow-auto', // ← scroll tady
  backdrop: 'absolute inset-0 bg-black/50',
  content: 'relative min-h-full flex flex-col' // ← už ne overflow-auto
}


export const Overlay = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    document.body.classList.add("overflow-hidden")
    return () => document.body.classList.remove("overflow-hidden")
  }, [])

  return (
    <div className={ui.overlay}>
      <div className={ui.backdrop} />
      <div className={ui.content}>{children}</div>
    </div>
  )
}
