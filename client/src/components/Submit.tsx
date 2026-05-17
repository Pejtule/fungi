import { cn } from '../helpers/cn'

export type SubmitProps = {
  label: string
  loading: boolean
  loadingLabel?: string
}

export const Submit = ({ label, loading, loadingLabel }: SubmitProps) => {
  const ui = cn(
    'w-full py-2 rounded-lg',
    'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600',
    'font-medium text-white',
    'transition disabled:opacity-50',
  )

  return (
    <button type='submit' disabled={loading} className={ui}>
      {loadingLabel && loading ? loadingLabel : label}
    </button>
  )
}
