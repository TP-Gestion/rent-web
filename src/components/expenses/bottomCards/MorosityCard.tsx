interface MorosityCardProps {
  percentage?: number
  trend?: 'up' | 'down' | 'neutral'
  trendLabel?: string
  description?: string
  onVerInforme?: () => void
  onConfigurar?: () => void
}

export default function MorosityCard({
  percentage,
  trend,
  trendLabel,
  description,
  onVerInforme,
  onConfigurar,
}: MorosityCardProps) {
  const isUp = trend === 'up'
  const trendColor = isUp ? '#a33030' : '#2e7d4f'
  const trendBg = isUp ? '#fdf0f0' : '#eaf6ef'
  const trendArrow = isUp ? '↑' : trend === 'down' ? '↓' : '→'

  return (
    <div className="morosity-card">
      <div>
        <div className="bc-section-label morosity-card__header-label">Análisis de Rendimiento</div>
        <div className="morosity-card__title">Índice de Morosidad</div>
      </div>

      <div className="morosity-card__percentage-row">
        <span className="morosity-card__percentage">{percentage != null ? `${percentage.toFixed(1)}%` : ''}</span>
        <span
          className="morosity-card__trend-pill"
          style={{ '--trend-color': trendColor, '--trend-bg': trendBg } as React.CSSProperties}
        >
          {trendArrow} {trendLabel}
        </span>
      </div>

      <p className="morosity-card__description">{description ?? ''}</p>

      <div className="morosity-card__actions">
        <button onClick={onVerInforme} className="bc-button bc-button--primary">
          Ver informe
        </button>
        <button onClick={onConfigurar} className="bc-button bc-button--secondary">
          Configurar alertas
        </button>
      </div>
    </div>
  )
}
