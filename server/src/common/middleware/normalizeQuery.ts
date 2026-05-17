import type { Request, Response, NextFunction } from 'express'

export const normalizeQuery = (req: Request, _res: Response, next: NextFunction) => {
  req.normalizedQuery = normalize(req.query)
  next()
}

const normalize = (query: Record<string, any>) => {
  const normalized: Record<string, any> = {}

  for (const key of Object.keys(query)) {
    let value = query[key]

    if (value === '' || value === null) {
      normalized[key] = undefined
      continue
    }

    if (Array.isArray(value)) {
      normalized[key] = value.map(v => normalizeValue(v))
      continue
    }

    normalized[key] = [normalizeValue(value)]
  }

  return normalized
}

const normalizeValue = (value: any) => {
  if (value === 'true') return true
  if (value === 'false') return false
  if (!isNaN(value) && value.trim() !== '') return Number(value)
  return value
}
