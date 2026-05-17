const ui = 'text-sm text-red-600 dark:text-red-400 text-center'

export const FormError = ({ error }: { error: string }) => (
  <p className={ui}>{error}</p>
)
