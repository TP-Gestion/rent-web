/*
 * StatCard
 * Tarjeta de métrica reutilizable para el dashboard.
 *
 * Props:
 *  - label         → string  — título de la métrica (ej: "TOTAL FACTURADO")
 *  - value         → string  — valor principal (ej: "$4,280,000")
 *  - badge         → string  — texto secundario pequeño (ej: "+12% vs Feb 2025")
 *  - variant       → "default" | "warning" | "danger" | "success"
 */


import "./StatCard.css";

export default function StatCard({
  label,
  value,
  badge,
  variant,
}) {
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
  );
}
