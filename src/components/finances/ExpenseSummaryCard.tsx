import type { Building } from '../../service/propiedades'

interface ExpenseSummaryCardProps {
  selectedBuilding?: Building
  categoryLabel?: string
  frequencyLabel?: string
  durationLabel?: string
  amountLabel?: string
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="fin-summary__row">
      <span className="fin-summary__label">{label}</span>
      <span className="fin-summary__value">{value}</span>
    </div>
  )
}

export default function ExpenseSummaryCard({
  selectedBuilding,
  categoryLabel,
  frequencyLabel,
  durationLabel,
  amountLabel,
}: ExpenseSummaryCardProps) {
  return (
    <aside className="fin-card fin-card--sticky">
      <div className="fin-card__header">
        <div>
          <div className="fin-card__eyebrow">Resumen</div>
          <h2 className="fin-card__title">Vista previa del gasto</h2>
          <p className="fin-card__subtitle">
            Confirmá la propiedad y los importes antes de registrar el movimiento.
          </p>
        </div>
      </div>

      {!selectedBuilding ? (
        <div className="fin-empty-state">
          Seleccioná un edificio para ver el detalle financiero y el impacto mensual.
        </div>
      ) : (
        <div className="fin-summary">
          <div className="fin-summary__property">
            <div className="fin-summary__property-title">
              {selectedBuilding.name}
            </div>
            <div className="fin-summary__property-subtitle">
              {selectedBuilding.address}
            </div>
          </div>

          <SummaryRow label="Frecuencia" value={frequencyLabel ?? 'Pendiente'} />
          <SummaryRow label="Categoría" value={categoryLabel ?? 'Pendiente'} />
          <SummaryRow label="Duración" value={durationLabel ?? 'Pendiente'} />
          <SummaryRow label="Monto" value={amountLabel ?? 'Pendiente'} />
          <SummaryRow label="ID edificio" value={String(selectedBuilding.id)} />
          <SummaryRow label="Dirección" value={selectedBuilding.address} />
        </div>
      )}

      <div className="fin-card__note">
        La referencia y las observaciones quedan guardadas como soporte interno del registro.
      </div>
    </aside>
  )
}
