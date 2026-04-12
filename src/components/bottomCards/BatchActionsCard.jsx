const EnvelopeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="3" width="14" height="10" rx="2" fill="#D4A017" opacity="0.25" />
    <rect x="1" y="3" width="14" height="10" rx="2" stroke="#D4A017" strokeWidth="1.3" fill="none" />
    <path d="M1.5 4.5l6.5 5 6.5-5" stroke="#D4A017" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

const SyncIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M13.5 8A5.5 5.5 0 012.5 8" stroke="#D4A017" strokeWidth="1.4" strokeLinecap="round" fill="none" />
    <path
      d="M2.5 8A5.5 5.5 0 0113.5 8"
      stroke="#D4A017"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeDasharray="2 2"
      fill="none"
    />
    <path
      d="M11 5.5l2.5 2.5L16 5.5"
      stroke="#D4A017"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M5 10.5L2.5 8 0 10.5"
      stroke="#D4A017"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

function ActionRow({ icon, title, subtitle, onClick }) {
  return (
    <button onClick={onClick} className="action-row" aria-label={title}>
      <div className="action-row__icon-wrap">{icon}</div>

      <div className="action-row__text">
        <div className="action-row__title">{title}</div>
        <div className="action-row__subtitle">{subtitle}</div>
      </div>

      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="action-row__arrow">
        <path d="M5 3l4 4-4 4" stroke="#D4A017" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

export default function BatchActionsCard({
  pendingCount = 14,
  lastSyncLabel = "Hace 2hs",
  onSendReminders,
  onReconcileBank,
  version = "SOLARIS v2.6.0 · Enterprise Edition",
}) {
  return (
    <div className="batch-actions-card" role="region" aria-label="Acciones de lote">
      <div className="bc-section-label batch-actions-card__header-label">Acciones de Lote</div>

      <ActionRow
        icon={<EnvelopeIcon />}
        title="Enviar recordatorios"
        subtitle={`${pendingCount} pendientes detectados`}
        onClick={onSendReminders}
      />

      <ActionRow
        icon={<SyncIcon />}
        title="Conciliar bancos"
        subtitle={`Última sync: ${lastSyncLabel}`}
        onClick={onReconcileBank}
      />

      <div className="batch-actions-card__version">{version}</div>
    </div>
  );
}