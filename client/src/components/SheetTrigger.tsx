const ui = `
    backdrop-blur-xl 
    px-4 py-2 rounded-full active:scale-95 transition

    /* Light mode */
    bg-white/60 text-zinc-900 
    border border-zinc-300/60 
    shadow-[0_8px_24px_-4px_rgba(0,0,0,0.15)]

    /* Dark mode */
    dark:bg-white/10 dark:text-white 
    dark:border-white/20 
    dark:shadow-[0_8px_32px_rgba(0,0,0,0.35)]
    fixed bottom-4 right-4`

export type SheetTriggerProps = {
  label: string,
  onClick: () => void
}

export const SheetTrigger = ({ label, onClick }: SheetTriggerProps) => (
  <button onClick={onClick} className={ui}>{label}</button>
)