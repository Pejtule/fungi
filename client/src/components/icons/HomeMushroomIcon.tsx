type HomeMushroomIconProps = {
  size?: number
  angle?: number
  className?: string
}

export const HomeMushroomIcon = ({ size = 30, angle, className }: HomeMushroomIconProps) => (
  // copilot
  <svg
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    className={className}
    width={size}
    height={size}
    style={{ transform: `rotate(${angle}deg)` }}
  >
    <path d="M4 11.5L12 4.5L20 11.5" />
    <path d="M6.5 11.5V19.5H13" />

    <path d="M16.5 14.2C15.1 14.2 14.2 15.3 14.2 16.6H18.8C18.8 15.3 17.9 14.2 16.5 14.2Z" />
    <path d="M16.5 16.6V18.8" />
    <circle cx="17.4" cy="15.5" r="0.45" />
  </svg>
)
