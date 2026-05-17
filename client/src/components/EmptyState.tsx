export type EmptyStateProps = {
  text: string
  imgSrc?: string
}
export const EmptyState = ({ text, imgSrc }: EmptyStateProps) => (
  <div>
    {text}
  </div>
)