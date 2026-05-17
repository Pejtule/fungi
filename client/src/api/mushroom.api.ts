import { api } from './api'
import type { MushroomDetail, MushroomList } from '../types/Mushroom'

export async function getMushroom(id: string, options: { signal?: AbortSignal } = {}) {
  return api<MushroomDetail>(`/mushrooms/${id}`, {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
    signal: options.signal
  })
}

export async function getMushrooms(
  limit: number,
  offset: number,
  filters: Record<string, string[] | undefined>,
  options: { signal?: AbortSignal } = {}
) {
  const params = new URLSearchParams()

  params.set('limit', String(limit))
  params.set('offset', String(offset))

  Object.entries(filters).forEach(([key, values]) => {
    values?.forEach(v => params.append(key, v))
  })

  return api<MushroomList>(`/mushrooms?${params.toString()}`, {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
    signal: options.signal
  })
}
