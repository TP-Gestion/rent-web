import type { PropiedadListItem } from '../../service/propiedades'
import { formatCurrency, formatTipoUnidad } from '../../utils/propertyDetail'

interface ExpenseSummaryCardProps {
  selectedProperty?: PropiedadListItem
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
  selectedProperty,
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

      {!selectedProperty ? (
        <div className="fin-empty-state">
          Seleccioná una propiedad para ver el detalle financiero y el impacto mensual.
        </div>
      ) : (
        <div className="fin-summary">
          <div className="fin-summary__property">
            <div className="fin-summary__property-title">
              {selectedProperty.edificio} · Piso {selectedProperty.piso}
            </div>
            <div className="fin-summary__property-subtitle">
              {formatTipoUnidad(selectedProperty.tipoUnidad)}
            </div>
          </div>

          <SummaryRow label="Frecuencia" value={frequencyLabel ?? 'Pendiente'} />
          <SummaryRow label="Categoría" value={categoryLabel ?? 'Pendiente'} />
          <SummaryRow label="Duración" value={durationLabel ?? 'Pendiente'} />
          <SummaryRow label="Monto" value={amountLabel ?? 'Pendiente'} />
          <SummaryRow label="Alquiler" value={formatCurrency(selectedProperty.montoAlquiler)} />
          <SummaryRow label="Expensas base" value={formatCurrency(selectedProperty.expensas)} />
          <SummaryRow label="Total mensual" value={formatCurrency(selectedProperty.montoTotal)} />
          <SummaryRow label="Estado" value={selectedProperty.estadoPago} />
        </div>
      )}

      <div className="fin-card__note">
        La referencia y las observaciones quedan guardadas como soporte interno del registro.
      </div>
    </aside>
  )
}
