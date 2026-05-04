import type { StatVariant } from "../../propiedadService";
import "./StatCardLarge.css";

interface StatCardLargeProps {
  label: string;
  value: string;
  badge?: string;
  progressValue?: number; // 0-100 for progress bars
  indicator?: "up" | "down" | "neutral";
  indicatorLabel?: string;
  variant: StatVariant;
}

export default function StatCardLarge({
  label,
  value,
  badge,
  progressValue,
  indicator,
  indicatorLabel,
  variant,
}: StatCardLargeProps) {
  const indicatorSymbol = {
    up: "↑",
    down: "↓",
    neutral: "→",
  }[indicator || "neutral"];

  const indicatorColor = {
    up: "#22884d",
    down: "#e74c3c",
    neutral: "#000000",
  }[indicator || "neutral"];

  return (
    <div className={`stat-card-large stat-card-large--${variant}`}>
      <div className="stat-card-large__header">
        <div>
          <div className="stat-card-large__label">{label}</div>
          {indicatorLabel && (
            <div
              className="stat-card-large__indicator"
              style={{ color: indicatorColor }}
            >
              <span className="stat-card-large__indicator-symbol">
                {indicatorSymbol}
              </span>
              {indicatorLabel}
            </div>
          )}
        </div>
        {badge && (
          <span className="stat-card-large__badge">{badge}</span>
        )}
      </div>

      <div className="stat-card-large__value">{value}</div>

      {progressValue !== undefined && (
        <div className="stat-card-large__progress">
          <div
            className="stat-card-large__progress-bar"
            style={{ width: `${progressValue}%` }}
          />
        </div>
      )}
    </div>
  );
}
