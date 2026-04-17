import type { PropiedadDetalle } from "../../services/propertyService";
import { formatCurrency, formatDate } from "../../utils/propertyDetail";

interface Props {
  detalle: PropiedadDetalle;
}

export default function SummaryCard({ detalle }: Props) {
  const total =
    detalle.montoMensualExpensa +
    detalle.montoMensualGasto +
    detalle.gananciaMensualAlquiler;

  return (
    <div className="pd-card">
      <h2 className="pd-card__title">Resumen de Alquiler</h2>
      <div className="pd-summary__rows">
        <div className="pd-summary__item">
          <span className="pd-summary__item-label">Ganancia</span>
          <span className="pd-summary__item-value">
            {formatCurrency(detalle.gananciaMensualAlquiler)}
          </span>
        </div>
        <div className="pd-summary__item">
          <span className="pd-summary__item-label">Expensas</span>
          <span className="pd-summary__item-value">
            {formatCurrency(detalle.montoMensualExpensa)}
          </span>
        </div>
        <div className="pd-summary__item">
          <span className="pd-summary__item-label">Gastos</span>
          <span className="pd-summary__item-value">
            {formatCurrency(detalle.montoMensualGasto)}
          </span>
        </div>
        <div className="pd-summary__item">
          <span className="pd-summary__item-label">Vencimiento</span>
          <span className="pd-summary__item-value">
            {formatDate(detalle.fechaVencimiento)}
          </span>
        </div>
      </div>
      <div className="pd-summary__total">
        <div>
          <div className="pd-summary__total-label">Total Mensual</div>
          {detalle.montoAdeudado > 0 && (
            <div className="pd-summary__total-debt">
              Adeudado: {formatCurrency(detalle.montoAdeudado)}
            </div>
          )}
        </div>
        <span className="pd-summary__total-value">{formatCurrency(total)}</span>
      </div>
    </div>
  );
}
