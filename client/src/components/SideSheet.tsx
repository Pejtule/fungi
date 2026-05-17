import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ui = {
  backdrop: 'fixed inset-0 bg-black/40 z-40',
  sheet: `
    fixed top-0 right-0 h-full w-[360px] max-w-[90vw]
    bg-white dark:bg-slate-900 shadow-xl z-50
    flex flex-col
  `,
  header: `
    sticky top-0 z-10
    flex items-center justify-between
    px-4 py-3
    border-b border-slate-200 dark:border-slate-700
    bg-white/80 dark:bg-slate-900/80 backdrop-blur
  `,
  content: `
    flex-1 overflow-y-auto overscroll-contain
    px-4 py-4
  `,
}

type SideSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

export const SideSheet = ({ open, onOpenChange, children }: SideSheetProps) => {
  const [shouldRender, setShouldRender] = useState(open)

  useEffect(() => {
    if (open) setShouldRender(true)
  }, [open])

  const handleClose = () => {
    onOpenChange(false)
    setShouldRender(false)
  }

  return (
    <AnimatePresence>
      {shouldRender && (
        <>
          {/* Backdrop */}
          <motion.div
            className={ui.backdrop}
            onClick={handleClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Side Sheet */}
          <motion.div
            className={ui.sheet}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
          >
            {/* Header */}
            <div className={ui.header}>
              <h2 className='text-lg font-medium text-slate-900 dark:text-slate-100'>
                Filtr
              </h2>
              <button
                className='text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                onClick={handleClose}
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className={ui.content}>{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
