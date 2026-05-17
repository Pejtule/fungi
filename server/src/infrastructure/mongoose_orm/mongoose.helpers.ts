import { v7 as uuidv7 } from 'uuid'

export const createUuid = () => uuidv7()

export const stripUndefined = <T extends object>(obj: T) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined)
  ) as Partial<T>;
}

export const toDb = <T extends { id?: string }>(dto: T) => {
  const { id, ...rest } = dto
  const cleaned = stripUndefined(rest)
  return id ? { _id: id, ...cleaned } : cleaned
}

export const buildRegex = (regex: string[], key: string) => {
  return { latin: { $regex: regex[0], $options: 'i' } }
}
