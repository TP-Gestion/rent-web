const AUTH_KEY = 'rentweb:isAuthenticated'

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false
  return window.localStorage.getItem(AUTH_KEY) === 'true'
}

export function login(): void {
  window.localStorage.setItem(AUTH_KEY, 'true')
}

export function logout(): void {
  window.localStorage.removeItem(AUTH_KEY)
}
