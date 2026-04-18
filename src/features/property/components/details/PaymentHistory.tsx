import type { PagoHistorial } from "../../types/property";
import { formatCurrency, formatDate } from "../../utils/propertyDetail";
import DownloadIcon from "./DownloadIcon";

interface Props {
  pagos: PagoHistorial[];
}

const STATUS_LABEL: Record<string, string> = {
  PAGADO: "Pagado",
  PARCIAL: "Parcial",
  ADEUDADO: "Adeudado",
};

function EmptyPaymentHistory() {
  return (
    <div className="pd-empty">
      <span className="pd-empty__icon">📋</span>
      <p className="pd-empty__title">Sin registros de pago</p>
      <p className="pd-empty__sub">Los pagos registrados aparecerán aquí.</p>
    </div>
  );
}

export default function PaymentHistory({ pagos }: Props) {
  return (
    <div className="pd-card">
      <h2 className="pd-card__title">Historial de Pagos</h2>
      {pagos.length === 0 ? (
        <EmptyPaymentHistory />
      ) : (
        <table className="pd-payments__table">
          <thead>
            <tr>
              <th>Período</th>
              <th>Fecha de pago</th>
              <th>Monto</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {pagos.map((pago, idx) => (
              <tr key={idx}>
                <td style={{ fontWeight: 600, color: "#2c2820" }}>
                  {pago.periodo}
                </td>
                <td>{formatDate(pago.fechaPago)}</td>
                <td style={{ fontWeight: 600 }}>
                  {formatCurrency(pago.monto)}
                </td>
                <td>
                  <span
                    className={`pd-pay-status pd-pay-status--${pago.estado.toLowerCase()}`}
                  >
                    {STATUS_LABEL[pago.estado] ?? pago.estado}
                  </span>
                </td>
                <td>
                  <button
                    className="pd-icon-btn"
                    title="Descargar comprobante"
                    type="button"
                  >
                    <DownloadIcon />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
