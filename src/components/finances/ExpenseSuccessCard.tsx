interface ExpenseSuccessCardProps {
  propertyLabel: string
  categoryLabel: string
  frequencyLabel: string
  durationLabel: string
  amountLabel: string
  onCreateAnother: () => void
  onGoToExpensas: () => void
}

function SuccessRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="fin-success__row">
      <span className="fin-success__label">{label}</span>
      <span className="fin-success__value">{value}</span>
    </div>
  )
}

export default function ExpenseSuccessCard({
  propertyLabel,
  categoryLabel,
  frequencyLabel,
  durationLabel,
  amountLabel,
  onCreateAnother,
  onGoToExpensas,
}: ExpenseSuccessCardProps) {
  return (
    <div className="fin-success">
      <div className="fin-success__icon">✓</div>
      <h2 className="fin-success__title">Gasto registrado</h2>
      <p className="fin-success__subtitle">
        El movimiento quedó listo para seguimiento dentro del período activo.
      </p>

      <div className="fin-success__details">
        <SuccessRow label="Propiedad" value={propertyLabel} />
        <SuccessRow label="Categoría" value={categoryLabel} />
        <SuccessRow label="Frecuencia" value={frequencyLabel} />
        <SuccessRow label="Duración" value={durationLabel} />
        <SuccessRow label="Monto" value={amountLabel} />
      </div>

      <div className="fin-success__actions">
        <button type="button" className="fin-btn fin-btn--secondary" onClick={onCreateAnother}>
          Registrar otro
        </button>
        <button type="button" className="fin-btn fin-btn--primary" onClick={onGoToExpensas}>
          Volver a expensas
        </button>
      </div>
    </div>
  )
}
