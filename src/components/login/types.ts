export type AuthMode = 'login' | 'register'

export type FormField = 'name' | 'email' | 'password'

export type FieldErrors = Partial<Record<FormField, string>>

export interface AuthFormValues {
  name: string
  email: string
  password: string
}
