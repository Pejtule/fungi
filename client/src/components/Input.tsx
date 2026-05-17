import { cn } from '../helpers/cn'

export type InputProps = {
  label: string
  input: React.InputHTMLAttributes<HTMLInputElement>
}

export const Input = ({ label, input }: InputProps) => {
  const ui = {
    label: cn(
      'block',
      'text-sm font-medium',
      'text-gray-700 dark:text-gray-300',
    ),
    input: cn(
      'w-full px-3 py-2 mt-1 rounded-lg',
      'border border-gray-300 dark:border-zinc-600',
      'bg-white dark:bg-zinc-700',
      'text-sm text-gray-900 dark:text-gray-100',
      'focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400',
      'transition-colors',
    )
  }

  return (
    <label className={ui.label}>
      {label}
      <input className={ui.input} required {...input} />
    </label>
  )
}
