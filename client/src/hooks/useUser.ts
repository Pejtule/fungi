import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { apiGetMe, apiLogin, apiLogout } from '../api/user.api'
import type { User } from '../types/User'

export function useUser() {
  const { data: user, isLoading } = useUserQuery()
  return { user, isLoading }
}

function useUserQuery() {
  return useQuery<User>({
    queryKey: ['user'],
    queryFn: apiGetMe
  })
}

export function useUserActions() { 
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const login = async (email: string, password: string) => {
    await apiLogin(email, password)
    await queryClient.invalidateQueries({ queryKey: ['user'] })
    navigate('/admin', { replace: true })
  }

  const logout = async () => {
    await apiLogout()
    navigate('/mushrooms', { replace: true })
    await queryClient.invalidateQueries({ queryKey: ['user'] })
  }

  return { login, logout }
}
