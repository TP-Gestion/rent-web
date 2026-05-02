interface RecentActivityCardProps {
  periodLabel: string;
  lastSyncLabel: string;
  pendingUnits: number;
}

export default function RecentActivityCard({
  periodLabel,
  lastSyncLabel,
  pendingUnits,
}: RecentActivityCardProps) {
  return (
    <article className="dashboard-card">
      <div className="dashboard-card__header">
        <h2>Actividad reciente</h2>
      </div>
      <ul className="dashboard-activity-list">
        <li>Se actualizaron métricas de cartera para {periodLabel}.</li>
        <li>Última sincronización operativa: {lastSyncLabel}.</li>
        <li>Tenés {pendingUnits} unidades con estado pendiente de cobro.</li>
      </ul>
    </article>
  );
}
