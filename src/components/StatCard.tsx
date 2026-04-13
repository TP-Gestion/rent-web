import type { StatVariant } from '../propiedadService'
import './StatCard.css'

interface StatCardProps {
  label: string
  value: string
  badge?: string
  variant: StatVariant
}

export default function StatCard({ label, value, badge, variant }: StatCardProps) {
  return (
    <div className={`stat-card stat-card--${variant}`}>
      {/* Barra de acento izquierda */}
      <div className="stat-card__accent-bar" />

      {/* Label */}
      <div className="stat-card__label">{label}</div>

      {/* Valor + Badge */}
      <div className="stat-card__value-row">
        <span className="stat-card__value">{value}</span>
        {badge && <span className="stat-card__badge">{badge}</span>}
      </div>
    </div>
  )
}

