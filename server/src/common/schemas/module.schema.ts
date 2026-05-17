import z from 'zod'

// PREPROCESS FUNCTIONS
export const processNumber = (v: number) => {
  const s = String(v).trim()
  return s === '' ? undefined : Number(s)
}

export const processNumberWithDefaultZero = (v: number) => {
  if(!v) return 0
  const s = String(v).trim()
  return s === '' ? 0 : Number(s)
}

export const processNumberWithDefaultNull = (v: number) => {
  if(!v) return null
  const s = String(v).trim()
  return s === '' ? null : Number(s)
}

// SCHEMAS
export const uuidSchema = z.string().trim().uuid()
