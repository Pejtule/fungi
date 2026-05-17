type LogoutIconProps = {
  size?: number
  angle?: number
  className?: string
}

export const LogoutIcon = ({ size = 25, angle, className }: LogoutIconProps) => (
  // https://heroicons.com/
  <svg
    fill="currentColor"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    style={{ transform: `rotate(${angle}deg)` }}
  >
    <path
      fillRule="evenodd"
      d="M7.5 3.75a1.5 1.5 0 0 0-1.5 1.5v13.5a1.5 1.5 0 0 0 1.5 1.5h6a1.5 1.5 0 0 0 1.5-1.5V15a.75.75 0 0 1 1.5 0v3.75a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3V5.25a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3V9a.75.75 0 1 1-1.5 0V5.25a1.5 1.5 0 0 0-1.5-1.5h-6ZM18.22 8.47a.75.75 0 0 1 1.06 0l3 3a.75.75 0 0 1 0 1.06l-3 3a.75.75 0 0 1-1.06-1.06l1.72-1.72H9a.75.75 0 0 1 0-1.5h10.94l-1.72-1.72a.75.75 0 0 1 0-1.06Z"
      clipRule="evenodd"
    />
  </svg>
)
