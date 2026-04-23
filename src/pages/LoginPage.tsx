import { useState } from 'react'
import { useNavigate } from 'react-router'
import { setAuthenticatedSession } from '../authSession'
import {
  AuthModeSwitch,
  LoginForm,
  type AuthFormValues,
  type AuthMode,
  type FieldErrors,
  type FormField,
} from '../components/login'
import { getAuthErrorMessage, getFieldErrors } from '../components/login/utils'
import { loginSchema, registerSchema } from '../schemas/authSchema'
import { login as loginRequest, register as registerRequest } from '../service/auth'
import './LoginPage.css'

const INITIAL_VALUES: AuthFormValues = {
  name: '',
  email: '',
  password: '',
}

export default function LoginPage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<AuthMode>('login')
  const [values, setValues] = useState<AuthFormValues>(INITIAL_VALUES)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const isRegisterMode = mode === 'register'

  const handleModeChange = (nextMode: AuthMode) => {
    setMode(nextMode)
    setErrorMessage(null)
    setFieldErrors({})
  }

  const handleValueChange = (field: FormField, value: string) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (isSubmitting) {
      return
    }

    setErrorMessage(null)
    setFieldErrors({})

    const loginValues = {
      email: values.email.trim(),
      password: values.password,
    }

    const validationResult = isRegisterMode
      ? registerSchema.safeParse({
          ...loginValues,
          name: values.name.trim(),
        })
      : loginSchema.safeParse(loginValues)

    if (!validationResult.success) {
      setFieldErrors(getFieldErrors(validationResult.error.issues))
      return
    }

    setIsSubmitting(true)

    try {
      const response = isRegisterMode
        ? await registerRequest({
            name: values.name.trim(),
            email: values.email.trim(),
            password: values.password,
          })
        : await loginRequest({
            email: values.email.trim(),
            password: values.password,
          })

      setAuthenticatedSession(response.data)
      navigate('/dashboard', { replace: true })
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(mode, error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-page__glow login-page__glow--one" aria-hidden="true" />
      <div className="login-page__glow login-page__glow--two" aria-hidden="true" />

      <section className="login-card" aria-labelledby="login-title">
        <div className="login-card__brand">SOLARIS</div>
        <p className="login-card__subtitle">ADMIN CONSOLE</p>

        <AuthModeSwitch mode={mode} disabled={isSubmitting} onChange={handleModeChange} />

        <LoginForm
          mode={mode}
          values={values}
          fieldErrors={fieldErrors}
          errorMessage={errorMessage}
          isSubmitting={isSubmitting}
          onValueChange={handleValueChange}
          onSubmit={handleSubmit}
        />
      </section>
    </div>
  )
}
