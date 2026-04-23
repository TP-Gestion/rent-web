import { isAxiosError } from 'axios'
import type { ZodIssue } from 'zod'
import type { AuthMode, FieldErrors } from './types'

export function getFieldErrors(issues: ZodIssue[]): FieldErrors {
  const errors: FieldErrors = {}

  for (const issue of issues) {
    const field = issue.path[0]
    if (typeof field === 'string' && (field === 'name' || field === 'email' || field === 'password')) {
      if (!errors[field]) {
        errors[field] = issue.message
      }
    }
  }

  return errors
}

export function getAuthErrorMessage(mode: AuthMode, error: unknown): string {
  const fallbackMessage =
    mode === 'register'
      ? 'No se pudo crear la cuenta. Intentá nuevamente en unos segundos.'
      : 'No se pudo iniciar sesión. Intentá nuevamente en unos segundos.'

  if (!isAxiosError(error)) {
    return fallbackMessage
  }

  const backendMessage =
    typeof error.response?.data?.message === 'string'
      ? error.response.data.message
      : null

  if (backendMessage) {
    return backendMessage
  }

  return mode === 'register'
    ? 'No se pudo crear la cuenta. Revisá los datos e intentá nuevamente.'
    : 'No se pudo iniciar sesión. Verificá tus credenciales.'
}

export function getModeTexts(mode: AuthMode) {
  if (mode === 'register') {
    return {
      title: 'Crear cuenta',
      hint: 'Completá tus datos para crear una cuenta nueva.',
      submittingLabel: 'Creando cuenta...',
      submitLabel: 'Crear cuenta',
    }
  }

  return {
    title: 'Iniciar sesión',
    hint: 'Ingresá con tu email y contraseña para continuar.',
    submittingLabel: 'Ingresando...',
    submitLabel: 'Entrar',
  }
}
