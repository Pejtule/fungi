import { api } from './api'
import type { User } from '../types/User'

export function apiGetMe(options: { signal?: AbortSignal } = {}) {
  return api<User>('/me', {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
    credentials: 'include' as const,
    cache: 'no-store',
    signal: options.signal
  })
}

export function apiLogin(email: string, password: string) {
  return api('/login', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'include' as const,
    body: JSON.stringify({ email, password })
  })
}

export function apiLogout() {
  return api('/logout', {
    method: 'POST',
    headers: { 'Accept': 'application/json' },
    credentials: 'include' as const
  })
}
