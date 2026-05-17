export const first = <T>(value?: T | T[]): T | undefined => {
  if (value === undefined) return undefined
  return Array.isArray(value) ? value[0] : value
}
