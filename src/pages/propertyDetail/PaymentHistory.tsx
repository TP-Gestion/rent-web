import { useState } from "react";
import type { Billing } from "../../service/propiedades";
import { formatCurrency, formatDate } from "../../utils/propertyDetail";
import DataTablePagination from "../../components/tenants/dataTable/DataTablePagination";

const PAGE_SIZE = 8;

interface Props {
  facturas: Billing[];
  isLoading?: boolean;
}

const ESTADO_LABEL: Record<string, string> = {
  PAID: "Pagado",
  PENDING: "Pendiente",
  OVERDUE: "Vencido",
};

const ESTADO_CSS: Record<string, string> = {
  PAID: "pd-pay-status--pagado",
  PENDING: "pd-pay-status--parcial",
  OVERDUE: "pd-pay-status--adeudado",
};

function EmptyPaymentHistory() {
  return (
    <div className="pd-empty">
      <span className="pd-empty__icon">📋</span>
      <p className="pd-empty__title">Sin facturas</p>
      <p className="pd-empty__sub">Los períodos facturados aparecerán aquí.</p>
    </div>
  );
}

export default function PaymentHistory({ facturas, isLoading }: Props) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(facturas.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = facturas.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <div className="pd-card">
      <h2 className="pd-card__title">Historial de Pagos</h2>
      {isLoading ? (
        <div className="pd-empty">
          <p className="pd-empty__sub">Cargando...</p>
        </div>
      ) : facturas.length === 0 ? (
        <EmptyPaymentHistory />
      ) : (
        <>
          <table className="pd-payments__table">
            <thead>
              <tr>
                <th>Período</th>
                <th>Vencimiento</th>
                <th>Fecha de pago</th>
                <th>Monto</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((f) => (
                <tr key={f.id}>
                  <td style={{ fontWeight: 600 }}>{f.period}</td>
                  <td>{formatDate(f.dueDate)}</td>
                  <td>
                    {f.paymentDate ? (
                      formatDate(f.paymentDate)
                    ) : (
                      <span style={{ color: "#b8a882" }}>—</span>
                    )}
                  </td>
                  <td style={{ fontWeight: 600 }}>
                    {formatCurrency(f.amount)}
                  </td>
                  <td>
                    <span
                      className={`pd-pay-status ${ESTADO_CSS[f.status] ?? ""}`}
                    >
                      {ESTADO_LABEL[f.status] ?? f.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {totalPages > 1 && (
            <DataTablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalResults={facturas.length}
              perPage={PAGE_SIZE}
              onChange={setPage}
            />
          )}
        </>
      )}
    </div>
  );
}
