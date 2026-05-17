import * as React from 'react'
import { motion, AnimatePresence, type PanInfo } from 'framer-motion'

type BottomSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  open,
  onOpenChange,
  children,
}) => {
  const isIOS15 =
    typeof navigator !== 'undefined' &&
    /OS 1[0-5]_\d+/.test(navigator.userAgent)

  const isPortrait =
    typeof window !== 'undefined' &&
    window.matchMedia('(orientation: portrait)').matches

  const dragEnabled = !isIOS15 && !isPortrait
  const closeThreshold = 120

  const [shouldRender, setShouldRender] = React.useState(open)

  React.useEffect(() => {
    if (open) setShouldRender(true)
  }, [open])

  const handleClose = () => {
    onOpenChange(false) // UI stav se změní hned
    setShouldRender(false) // sheet zůstane v DOMU → exit animace proběhne
  }

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.y > closeThreshold) {
      handleClose()
    }
  }

  return (
    <AnimatePresence
      onExitComplete={() => {
        // exit animace skončila → sheet se může unmountnout
        setShouldRender(false)
      }}
    >
      {shouldRender && (
        <>
          <motion.div
            className='fixed inset-0 bg-black/40'
            onClick={handleClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className='
              fixed left-1/2 -translate-x-1/2 bottom-0
              w-full max-w-[600px]
              bg-white dark:bg-slate-900
              rounded-t-2xl shadow-xl
              overflow-hidden
            '
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
          >
            <div className='relative py-3 flex justify-center items-center'>
              {dragEnabled ? (
                <motion.div
                  className='cursor-grab active:cursor-grabbing touch-none'
                  drag='y'
                  dragConstraints={{ top: 0, bottom: 0 }}
                  dragElastic={0.2}
                  onDragEnd={handleDragEnd}
                >
                  <div className='w-12 h-1.5 bg-slate-400/50 rounded-full' />
                </motion.div>
              ) : (
                <div className='w-12 h-1.5 bg-slate-400/50 rounded-full opacity-60' />
              )}

              <button
                className='absolute right-4 top-1/2 -translate-y-1/2 text-slate-500'
                onClick={handleClose}
              >
                ✕
              </button>
            </div>

            <div
              className='
                max-h-[calc(100dvh-120px)]
                overflow-y-auto
                overscroll-contain
                touch-pan-y
                px-4 pb-6
              '
            >
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
