export const NodeLabel = ({ label, isHeader }: { label: string, isHeader: boolean }) => {
  const ui = 'whitespace-nowrap'

  if (isHeader) return <h3 className={ui}>{label}</h3>

  return <span className={ui}>{label}</span>
}
