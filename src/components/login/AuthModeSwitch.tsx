type AuthMode = 'login' | 'register'

interface AuthModeSwitchProps {
  mode: AuthMode
  disabled: boolean
  onChange: (mode: AuthMode) => void
}

export default function AuthModeSwitch({
  mode,
  disabled,
  onChange,
}: AuthModeSwitchProps) {
  return (
    <div className="auth-mode-switch" role="group" aria-label="Seleccionar tipo de acceso">
      <button
        type="button"
        className={`auth-mode-switch__button ${mode === 'login' ? 'is-active' : ''}`}
        onClick={() => onChange('login')}
        disabled={disabled}
      >
        Iniciar sesión
      </button>

      <button
        type="button"
        className={`auth-mode-switch__button ${mode === 'register' ? 'is-active' : ''}`}
        onClick={() => onChange('register')}
        disabled={disabled}
      >
        Registrarme
      </button>
    </div>
  )
}