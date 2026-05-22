import { apiClient } from './client'
import type { RegisterInput, LoginInput, AuthResponse } from '../schemas/authSchemas'

export async function register(data: RegisterInput): Promise<AuthResponse> {
  const url = 'auth/register'
  const { data: res } = await apiClient.post<AuthResponse>(url, data)
  return res
}

export async function login(data: LoginInput): Promise<AuthResponse> {
  const url = 'auth/login'
  const { data: res } = await apiClient.post<AuthResponse>(url, data)
  return res
}
