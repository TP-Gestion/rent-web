import { apiClient } from './client'
import type { RegisterInput, LoginInput, AuthResponse } from '../schemas/authSchemas'

function buildEndpoint(pathSuffix: string) {
  const base = (apiClient.defaults.baseURL || '').replace(/\/$/, '')
  const suffix = pathSuffix.replace(/^\//, '')

  if (base.endsWith('/api')) {
    return `${base}/${suffix}`
  }

  return `${base}/api/${suffix}`
}

export async function register(data: RegisterInput): Promise<AuthResponse> {
  const url = buildEndpoint('v1/auth/register')
  const { data: res } = await apiClient.post<AuthResponse>(url, data)
  return res
}

export async function login(data: LoginInput): Promise<AuthResponse> {
  const url = buildEndpoint('v1/auth/login')
  const { data: res } = await apiClient.post<AuthResponse>(url, data)
  return res
}
