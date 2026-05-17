import { api } from './api'
import type { Taxon } from '../types/Taxon'

export function getTaxonChildren(id: string | null, options: { signal?: AbortSignal } = {}) {
  const params = id ? `?parentId=${id}` : ''

  return api<Taxon[]>(`/taxa/children${params}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    signal: options.signal
  })
}
