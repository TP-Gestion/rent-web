import { useState } from 'react'
import { useNavigate } from 'react-router'
import { login } from '../auth'
import './LoginPage.css'

export default function LoginPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Login temporal: permite cualquier combinación de usuario y contraseña.
    void username
    void password
    login()
    navigate('/dashboard', { replace: true })
  }

  return (
    <div className="login-page">
      <div className="login-page__glow login-page__glow--one" aria-hidden="true" />
      <div className="login-page__glow login-page__glow--two" aria-hidden="true" />

      <section className="login-card" aria-labelledby="login-title">
        <div className="login-card__brand">SOLARIS</div>
        <p className="login-card__subtitle">ADMIN CONSOLE</p>

        <h1 id="login-title" className="login-card__title">Iniciar sesión</h1>
        <p className="login-card__hint">Ingresá con cualquier usuario y contraseña para continuar.</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="login-form__label" htmlFor="username">Usuario</label>
          <input
            id="username"
            className="login-form__input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="ej: admin"
            autoComplete="username"
          />

          <label className="login-form__label" htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            className="login-form__input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
          />

          <button type="submit" className="login-form__submit">
            Entrar
          </button>
        </form>
      </section>
    </div>
  )
}
