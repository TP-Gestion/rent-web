interface RisksCardProps {
  morosityPercentage: number;
  morosityTrendLabel: string;
  overdueUnits: number;
  pendingBatchActions: number;
  lastSyncLabel: string;
}

export default function RisksCard({
  morosityPercentage,
  morosityTrendLabel,
  overdueUnits,
  pendingBatchActions,
  lastSyncLabel,
}: RisksCardProps) {
  return (
    <article className="dashboard-card">
      <div className="dashboard-card__header">
        <h2>Riesgos y alertas</h2>
      </div>
      <ul className="dashboard-alert-list">
        <li>
          Morosidad actual: <strong>{morosityPercentage}%</strong> ({morosityTrendLabel}).
        </li>
        <li>
          Casos con seguimiento urgente: <strong>{overdueUnits}</strong> unidades vencidas.
        </li>
        <li>
          Acciones batch pendientes: <strong>{pendingBatchActions}</strong> ({lastSyncLabel}).
        </li>
      </ul>
    </article>
  );
}
