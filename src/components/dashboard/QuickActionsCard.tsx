interface QuickActionsCardProps {
  onNewProperty: () => void;
  onNewExpense: () => void;
  onLiquidation: () => void;
  onReminders: () => void;
}

export default function QuickActionsCard({
  onNewProperty,
  onNewExpense,
  onLiquidation,
  onReminders,
}: QuickActionsCardProps) {
  return (
    <article className="dashboard-card">
      <div className="dashboard-card__header">
        <h2>Acciones rápidas</h2>
      </div>
      <div className="dashboard-actions">
        <button type="button" onClick={onNewProperty}>Nueva propiedad</button>
        <button type="button" onClick={onNewExpense}>Cargar gasto</button>
        <button type="button" onClick={onLiquidation}>Generar liquidación</button>
        <button type="button" onClick={onReminders}>Enviar recordatorios</button>
      </div>
    </article>
  );
}
