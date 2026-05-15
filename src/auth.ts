type User = {
  id: number
  name: string
  email: string
}

const TOKEN_KEY = 'auth.token'
const USER_KEY = 'auth.user'

export function isAuthenticated(): boolean {
  return Boolean(getToken())
}

export function getToken(): string | undefined {
  try {
    return localStorage.getItem(TOKEN_KEY) ?? undefined
  } catch {
    return undefined
  }
}

export function getUser(): User | undefined {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? (JSON.parse(raw) as User) : undefined
  } catch {
    return undefined
  }
}

export function login(user: User, token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  } catch {
  }
}

export function logout(): void {
  try {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  } catch {
  }
}
