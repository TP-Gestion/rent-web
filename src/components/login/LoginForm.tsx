import type { FormEventHandler } from 'react'
import type { AuthMode, AuthFormValues, FieldErrors, FormField } from './types'
import { getModeTexts } from './utils'

interface LoginFormProps {
  mode: AuthMode
  values: AuthFormValues
  fieldErrors: FieldErrors
  errorMessage: string | null
  isSubmitting: boolean
  onValueChange: (field: FormField, value: string) => void
  onSubmit: FormEventHandler<HTMLFormElement>
}

export default function LoginForm({
  mode,
  values,
  fieldErrors,
  errorMessage,
  isSubmitting,
  onValueChange,
  onSubmit,
}: LoginFormProps) {
  const isRegisterMode = mode === 'register'
  const modeTexts = getModeTexts(mode)

  return (
    <>
      <h1 id="login-title" className="login-card__title">
        {modeTexts.title}
      </h1>
      <p className="login-card__hint">{modeTexts.hint}</p>

      <form className="login-form" onSubmit={onSubmit}>
        {isRegisterMode && (
          <>
            <label className="login-form__label" htmlFor="name">Nombre</label>
            <input
              id="name"
              type="text"
              className={`login-form__input ${fieldErrors.name ? 'has-error' : ''}`}
              value={values.name}
              onChange={(e) => onValueChange('name', e.target.value)}
              placeholder="ej: Ana García"
              autoComplete="name"
            />
            {fieldErrors.name && (
              <p className="login-form__field-error" role="alert">{fieldErrors.name}</p>
            )}
          </>
        )}

        <label className="login-form__label" htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          className={`login-form__input ${fieldErrors.email ? 'has-error' : ''}`}
          value={values.email}
          onChange={(e) => onValueChange('email', e.target.value)}
          placeholder="ej: admin@solaris.com"
          autoComplete="email"
        />
        {fieldErrors.email && (
          <p className="login-form__field-error" role="alert">{fieldErrors.email}</p>
        )}

        <label className="login-form__label" htmlFor="password">Contraseña</label>
        <input
          id="password"
          type="password"
          className={`login-form__input ${fieldErrors.password ? 'has-error' : ''}`}
          value={values.password}
          onChange={(e) => onValueChange('password', e.target.value)}
          placeholder="••••••••"
          autoComplete={isRegisterMode ? 'new-password' : 'current-password'}
        />
        {fieldErrors.password && (
          <p className="login-form__field-error" role="alert">{fieldErrors.password}</p>
        )}

        {errorMessage && (
          <p className="login-form__error" role="alert">{errorMessage}</p>
        )}

        <button type="submit" className="login-form__submit" disabled={isSubmitting}>
          {isSubmitting ? modeTexts.submittingLabel : modeTexts.submitLabel}
        </button>
      </form>
    </>
  )
}
