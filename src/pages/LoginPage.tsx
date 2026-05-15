import { useState } from 'react'
import { useNavigate } from 'react-router'
import { AxiosError } from 'axios'
import { ZodError } from 'zod'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { login as setAuth } from '../auth'
import { register as registerService, login as loginService } from '../service/login'
import { registerSchema, loginSchema } from '../schemas/authSchemas'
import './LoginPage.css'

export default function LoginPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [errors, setErrors] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const passwordRequirements = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setErrors(null)
    try {
      if (mode === 'register') {
        const parsed = registerSchema.parse({ name, email, password })
        const res = await registerService(parsed)
        setAuth({ id: res.id, name: res.name, email: res.email }, res.dummyToken)
        navigate('/dashboard', { replace: true })
      } else {
        const parsed = loginSchema.parse({ email, password })
        const res = await loginService(parsed)
        setAuth({ id: res.id, name: res.name, email: res.email }, res.dummyToken)
        navigate('/dashboard', { replace: true })
      }
    } catch (err: unknown) {
      let errorMsg = 'Error de autenticación'
      
      if (err instanceof ZodError) {
        errorMsg = err.errors[0]?.message || 'Validación fallida'
      } else if (err instanceof AxiosError) {
        const status = err.response?.status
        
        // Errores de credenciales inválidas o usuario no encontrado
        if (status === 401 || status === 404 || status === 400) {
          errorMsg = mode === 'login' 
            ? 'Email o contraseña incorrectos'
            : 'Este email ya está registrado o datos inválidos'
        } else {
          // Otros errores de servidor
          errorMsg = `Error del servidor: ${status || 'desconocido'}`
        }
      } else if (err instanceof Error) {
        errorMsg = err.message
      }
      
      setErrors(errorMsg)
    }
  }

  return (
    <div className="login-page">
      <div className="login-page__glow login-page__glow--one" aria-hidden="true" />
      <div className="login-page__glow login-page__glow--two" aria-hidden="true" />

      <section className="login-card" aria-labelledby="login-title">
        <div className="login-card__brand">SOLARIS</div>
        <p className="login-card__subtitle">ADMIN CONSOLE</p>

        <h1 id="login-title" className="login-card__title">
          {mode === 'login' ? 'Iniciar sesión' : 'Registrarse'}
        </h1>
        <p className="login-card__hint">{mode === 'login' ? 'Ingresá con tu email y contraseña.' : 'Creá una cuenta nueva.'}</p>

        <form className="login-form" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <>
              <label className="login-form__label" htmlFor="name">Nombre</label>
              <input
                id="name"
                className="login-form__input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ej: Juan Perez"
                autoComplete="name"
              />
            </>
          )}

          <label className="login-form__label" htmlFor="email">Email</label>
          <input
            id="email"
            className="login-form__input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ej: mail@dominio.com"
            autoComplete="username"
          />

          <label className="login-form__label" htmlFor="password">Contraseña</label>
          <div className="login-form__password-wrapper">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className="login-form__input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
            <button
              type="button"
              className="login-form__password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? <VisibilityOff sx={{ fontSize: 18, color: '#8e8574' }} /> : <Visibility sx={{ fontSize: 18, color: '#8e8574' }} />}
            </button>
          </div>

          {mode === 'register' && (
            <div className="login-form__requirements">
              <div className={`login-form__requirement ${passwordRequirements.minLength ? 'login-form__requirement--met' : ''}`}>
                <span className="login-form__requirement-dot">•</span>
                <span>Al menos 8 caracteres</span>
              </div>
              <div className={`login-form__requirement ${passwordRequirements.hasUppercase ? 'login-form__requirement--met' : ''}`}>
                <span className="login-form__requirement-dot">•</span>
                <span>Una mayúscula</span>
              </div>
            </div>
          )}

          {errors && <div style={{ color: '#dc2626', marginTop: 12, fontSize: '14px', fontWeight: '500', padding: '8px 12px', backgroundColor: '#fee2e2', borderRadius: '6px', border: '1px solid #fecaca' }}>{errors}</div>}

          <button type="submit" className="login-form__submit">
            {mode === 'login' ? 'Entrar' : 'Crear cuenta'}
          </button>

          <button
            type="button"
            className="login-form__submit"
            style={{ marginTop: 8, background: 'transparent', color: 'var(--muted)' }}
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login')
              setErrors(null)
            }}
          >
            {mode === 'login' ? '¿No tenés cuenta? Registrarse' : '¿Ya tenés cuenta? Iniciar sesión'}
          </button>
        </form>
      </section>
    </div>
  )
}
