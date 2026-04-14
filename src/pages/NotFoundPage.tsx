import { useNavigate } from 'react-router'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        minHeight: '60vh',
        fontFamily: "'DM Sans', 'Trebuchet MS', sans-serif",
        gap: '12px',
        textAlign: 'center',
        padding: '40px 24px',
      }}
    >
      <div
        style={{
          fontSize: '10px',
          fontWeight: 600,
          color: '#b8a882',
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          marginBottom: '4px',
        }}
      >
        Sistema de Administración
      </div>

      <div
        style={{
          fontSize: '80px',
          fontWeight: 800,
          color: '#f0ece0',
          lineHeight: 1,
          letterSpacing: '-2px',
          userSelect: 'none',
        }}
      >
        404
      </div>

      <h1
        style={{
          fontSize: '28px',
          fontWeight: 800,
          color: '#2c2820',
          margin: 0,
          lineHeight: 1.1,
          letterSpacing: '-0.5px',
        }}
      >
        Página no encontrada
      </h1>

      <p
        style={{
          fontSize: '13px',
          color: '#9a9180',
          maxWidth: '340px',
          margin: '4px 0 20px',
          lineHeight: 1.6,
        }}
      >
        La ruta que intentás acceder no existe o fue movida. Revisá la URL o volvé al inicio.
      </p>

      <button
        onClick={() => navigate('/')}
        style={{
          padding: '9px 20px',
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.8px',
          textTransform: 'uppercase',
          backgroundColor: '#2c2820',
          color: '#fafaf7',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
        }}
      >
        Volver al inicio
      </button>
    </div>
  )
}
