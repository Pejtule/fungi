import { API_URL } from '../config'

export async function api<T>(path: string, init: RequestInit): Promise<T> {
  const url = `${API_URL}${path}`

  let res: Response

  // 1) síťové chyby
  try {
    res = await fetch(url, init)
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw err
    }
    throw new Error('Network error. Server unreachable.')
  }

  // 2) HTTP chyby
  if (res.status === 404) throw new Response('Not Found', { status: 404 })
  
  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}.`)
  }

  if (res.status === 204) return undefined as T

  // 3) JSON chyby
  try {
    return await res.json() as T
  } catch {
    throw new Error('Invalid JSON response from server.')
  }
}
