import type { StatVariant } from "../../propiedadService";
import "./StatCard.css";

interface StatCardProps {
  label: string;
  value: string;
  badge?: string;
  subtitle?: string;
  variant: StatVariant;
}

export default function StatCard({
  label,
  value,
  badge,
  subtitle,
  variant,
}: StatCardProps) {
  return (
    <div className={`stat-card stat-card--${variant}`}>
      <div className="stat-card__accent-bar" />
      <div className="stat-card__label">{label}</div>
      <div className="stat-card__value-row">
        <span className="stat-card__value">{value}</span>
        {badge && <span className="stat-card__badge">{badge}</span>}
      </div>
      {subtitle && <div className="stat-card__subtitle">{subtitle}</div>}
    </div>
  );
}
