import type { PropiedadDetalle } from "../../service/propiedades";
import { formatCurrency, formatDate } from "../../utils/propertyDetail";

interface Props {
  detalle: PropiedadDetalle;
}

const ESTADO_PAGO_LABEL: Record<string, string> = {
  PAGADO: "Al día",
  PENDIENTE: "Pendiente",
  VENCIDO: "Vencido",
};

export default function SummaryCard({ detalle }: Props) {
  const estadoCls = `pd-pay-status pd-pay-status--${detalle.estadoPago.toLowerCase()}`;

  return (
    <div className="pd-card">
      <div className="pd-card__title-row">
        <h2 className="pd-card__title">Resumen de Alquiler</h2>
        <span className={estadoCls}>
          {ESTADO_PAGO_LABEL[detalle.estadoPago] ?? detalle.estadoPago}
        </span>
      </div>
      <div className="pd-summary__rows">
        <div className="pd-summary__item">
          <span className="pd-summary__item-label">Alquiler</span>
          <span className="pd-summary__item-value">
            {formatCurrency(detalle.montoAlquiler)}
          </span>
        </div>
        <div className="pd-summary__item">
          <span className="pd-summary__item-label">Expensas</span>
          <span className="pd-summary__item-value">
            {formatCurrency(detalle.expensas)}
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
        <div className="pd-summary__total-label">Total Mensual</div>
        <span className="pd-summary__total-value">
          {formatCurrency(detalle.montoTotal)}
        </span>
      </div>
    </div>
  );
}
