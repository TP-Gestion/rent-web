import "./BottomCards.css";

// MorosityCard
/**
 * MorosityCard
 * Panel de análisis de rendimiento con índice de morosidad.
 *
 * Props:
 *  - percentage      → number  — porcentaje de morosidad (ej: 12.4)
 *  - trend           → "up" | "down" | "stable"
 *  - trendLabel      → string  — texto del trend (ej: "crítico")
 *  - description     → string  — descripción del análisis
 *  - onVerInforme    → callback al hacer click en "Ver informe"
 *  - onConfigurar    → callback al hacer click en "Configurar alertas"
 */
export function MorosityCard({
  percentage = 12.4,
  trend = "up",
  trendLabel = "crítico",
  description = "Se detectó un incremento del 4% en pagos fuera de término para el segmento comercial en Torre Solaris I. Se recomienda iniciar gestiones preventivas.",
  onVerInforme,
  onConfigurar,
}) {
  const isUp = trend === "up";
  const trendColor = isUp ? "#a33030" : "#2e7d4f";
  const trendBg = isUp ? "#fdf0f0" : "#eaf6ef";
  const trendArrow = isUp ? "↑" : trend === "down" ? "↓" : "→";

  return (
    <div className="morosity-card" role="region" aria-label="Análisis de rendimiento - Índice de morosidad">
      {/* Header */}
      <div>
        <div className="bc-section-label morosity-card__header-label">
          Análisis de Rendimiento
        </div>
        <div className="morosity-card__title">
          Índice de Morosidad
        </div>
      </div>

      {/* Porcentaje */}
      <div className="morosity-card__percentage-row">
        <span className="morosity-card__percentage">
          {percentage.toFixed(1)}%
        </span>
        <span
          className="morosity-card__trend-pill"
          style={{ "--trend-color": trendColor, "--trend-bg": trendBg }}
        >
          {trendArrow} {trendLabel}
        </span>
      </div>

      {/* Descripción */}
      <p className="morosity-card__description">
        {description}
      </p>

      {/* Acciones */}
      <div className="morosity-card__actions">
        <button
          onClick={onVerInforme}
          className="bc-button bc-button--primary"
        >
          Ver informe
        </button>
        <button
          onClick={onConfigurar}
          className="bc-button bc-button--secondary"
        >
          Configurar alertas
        </button>
      </div>
    </div>
  );
}

// BatchActionsCard
/**
 * BatchActionsCard
 * Panel de acciones de lote: enviar recordatorios y conciliar bancos.
 *
 * Props:
 *  - pendingCount      → number  — cantidad de recordatorios pendientes
 *  - lastSyncLabel     → string  — texto de última sincronización (ej: "Hace 2hs")
 *  - onSendReminders   → callback al hacer click en "Enviar recordatorios"
 *  - onReconcileBank   → callback al hacer click en "Conciliar bancos"
 *  - version           → string  — versión del sistema (ej: "v2.6.0 · Enterprise Edition")
 */

const EnvelopeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="3" width="14" height="10" rx="2" fill="#D4A017" opacity="0.25" />
    <rect x="1" y="3" width="14" height="10" rx="2" stroke="#D4A017" strokeWidth="1.3" fill="none" />
    <path d="M1.5 4.5l6.5 5 6.5-5" stroke="#D4A017" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

const SyncIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M13.5 8A5.5 5.5 0 012.5 8"
      stroke="#D4A017"
      strokeWidth="1.4"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M2.5 8A5.5 5.5 0 0113.5 8"
      stroke="#D4A017"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeDasharray="2 2"
      fill="none"
    />
    <path d="M11 5.5l2.5 2.5L16 5.5" stroke="#D4A017" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d="M5 10.5L2.5 8 0 10.5" stroke="#D4A017" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

function ActionRow({ icon, title, subtitle, onClick }) {
  return (
    <button
      onClick={onClick}
      className="action-row"
      aria-label={title}
    >
      {/* Ícono */}
      <div className="action-row__icon-wrap">
        {icon}
      </div>

      {/* Texto */}
      <div className="action-row__text">
        <div className="action-row__title">
          {title}
        </div>
        <div className="action-row__subtitle">
          {subtitle}
        </div>
      </div>

      {/* Flecha */}
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        className="action-row__arrow"
      >
        <path d="M5 3l4 4-4 4" stroke="#D4A017" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

export function BatchActionsCard({
  pendingCount = 14,
  lastSyncLabel = "Hace 2hs",
  onSendReminders,
  onReconcileBank,
  version = "SOLARIS v2.6.0 · Enterprise Edition",
}) {
  return (
    <div className="batch-actions-card" role="region" aria-label="Acciones de lote">
      {/* Header */}
      <div className="bc-section-label batch-actions-card__header-label">
        Acciones de Lote
      </div>

      {/* Botón: Enviar recordatorios */}
      <ActionRow
        icon={<EnvelopeIcon />}
        title="Enviar recordatorios"
        subtitle={`${pendingCount} pendientes detectados`}
        onClick={onSendReminders}
      />

      {/* Botón: Conciliar bancos */}
      <ActionRow
        icon={<SyncIcon />}
        title="Conciliar bancos"
        subtitle={`Última sync: ${lastSyncLabel}`}
        onClick={onReconcileBank}
      />

      {/* Version */}
      <div className="batch-actions-card__version">
        {version}
      </div>
    </div>
  );
}