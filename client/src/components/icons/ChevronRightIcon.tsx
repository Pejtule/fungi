type ChevronRightIconProps = {
  size?: number
  angle?: number
  className?: string
}

export const ChevronRightIcon = ({ size = 25, angle, className }: ChevronRightIconProps) => (
  // https://heroicons.com/
  <svg
    fill='none'
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
    width={size}
    height={size}
    style={{ transform: `rotate(${angle}deg)` }}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
  </svg>
)
