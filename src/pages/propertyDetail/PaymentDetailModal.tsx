import { useState } from "react";
import type { Billing, PaymentRecord } from "../../service/propiedades";
import {
  downloadBillingFile,
  downloadPaymentReceipt,
} from "../../service/propiedades";
import { formatCurrency, formatDate } from "../../utils/propertyDetail";
import { ESTADO_LABEL, ESTADO_CSS } from "../../utils/billingStatus";
import "./PaymentHistory.css";
import DownloadIcon from "../../components/DownloadIcon";

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  BANK_TRANSFER: "Transferencia bancaria",
  CASH: "Efectivo",
  CHECK: "Cheque",
  DEBIT: "Débito automático",
  CREDIT: "Tarjeta de crédito",
};

function getPaymentMethodLabel(m: string) {
  return PAYMENT_METHOD_LABELS[m] ?? m;
}

function triggerBlobDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

interface Props {
  billing: Billing;
  pagos?: PaymentRecord[];
  isLoadingPagos?: boolean;
  propertyId?: string;
  onClose: () => void;
}

export default function PaymentDetailModal({
  billing,
  pagos = [],
  isLoadingPagos = false,
  propertyId,
  onClose,
}: Props) {
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [loadingReceipt, setLoadingReceipt] = useState<string | null>(null);
  const [loadingInvoice, setLoadingInvoice] = useState(false);

  const handleDownloadReceipt = async (
    paymentId: string,
    periods: string[],
  ) => {
    if (!propertyId) return;
    setLoadingReceipt(paymentId);
    setDownloadError(null);
    try {
      const blob = await downloadPaymentReceipt(propertyId, paymentId);
      triggerBlobDownload(blob, `Recibo-${periods.join("_")}.pdf`);
    } catch {
      setDownloadError(
        "No se pudo descargar el comprobante. Intentá nuevamente.",
      );
    } finally {
      setLoadingReceipt(null);
    }
  };

  const handleDownloadBillingFile = async () => {
    if (!propertyId) return;
    setLoadingInvoice(true);
    setDownloadError(null);
    try {
      const blob = await downloadBillingFile(propertyId, billing.id);
      triggerBlobDownload(blob, `Factura-${billing.period}.pdf`);
    } catch {
      setDownloadError("No se pudo descargar la factura. Intentá nuevamente.");
    } finally {
      setLoadingInvoice(false);
    }
  };

  return (
    <div className="pm-overlay" onClick={onClose}>
      <div className="pm-modal ph-modal" onClick={(e) => e.stopPropagation()}>
        <div className="pm-modal__header ph-modal__header">
          <h2 className="pm-modal__title ph-modal__title">
            Información de facturación
          </h2>
          <button
            className="pm-modal__close"
            onClick={onClose}
            type="button"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <div className="pm-modal__body ph-modal__body">
          {downloadError && (
            <div className="ph-download-error" role="alert">
              {downloadError}
            </div>
          )}

          <div className="pm-section">
            <div className="pm-section__label">DETALLE DE LA FACTURA</div>
            <div className="ph-grid">
              <div className="ph-grid__item">
                <div className="pm-field__label">Periodo</div>
                <div className="ph-field__value">{billing.period}</div>
              </div>
              <div className="ph-grid__item">
                <div className="pm-field__label">Fecha de vencimiento</div>
                <div className="ph-field__value">
                  {formatDate(billing.dueDate)}
                </div>
              </div>
              <div className="ph-grid__item">
                <div className="pm-field__label">Monto</div>
                <div className="ph-field__value">
                  {formatCurrency(billing.amount)}
                </div>
              </div>
              <div className="ph-grid__item">
                <div className="pm-field__label">Estado</div>
                <div className="ph-field__value">
                  <span
                    className={`ph-status ${ESTADO_CSS[billing.status] ?? ""}`}
                  >
                    {ESTADO_LABEL[billing.status] ?? billing.status}
                  </span>
                </div>
              </div>
              <div className="ph-grid__item ph-grid__item--full">
                <div className="pm-field__label">Inquilino</div>
                <div className="ph-field__value">
                  {billing.tenant
                    ? `${billing.tenant.firstName} ${billing.tenant.lastName}`
                    : "Inquilino no disponible"}
                </div>
              </div>
            </div>

            <div className="ph-payment-actions" style={{ marginTop: 14 }}>
              <button
                className="ph-download-btn"
                onClick={handleDownloadBillingFile}
                disabled={loadingInvoice}
                type="button"
              >
                <DownloadIcon />
                <span>
                  {loadingInvoice ? "Descargando..." : "Descargar factura"}
                </span>
              </button>
            </div>
          </div>

          <div className="pm-section" style={{ marginTop: 18 }}>
            <div className="pm-section__label">DETALLE DEL PAGO</div>
            {isLoadingPagos ? (
              <p>Cargando pagos...</p>
            ) : (
              (() => {
                const related = (pagos || []).filter((p) =>
                  p.periods.includes(billing.period),
                );
                if (related.length === 0)
                  return <p>No hay pagos registrados para este período.</p>;
                return (
                  <div className="ph-payment-list__container">
                    {related.map((p) => (
                      <div key={p.id} className="ph-payment-row">
                        <div className="ph-payment-content">
                          <div className="ph-grid" style={{ gap: 12 }}>
                            <div className="ph-grid__item">
                              <div className="pm-field__label">
                                Fecha de pago
                              </div>
                              <div className="ph-field__value">
                                {formatDate(p.date)}
                              </div>
                            </div>
                            <div className="ph-grid__item">
                              <div className="pm-field__label">
                                Método de pago
                              </div>
                              <div className="ph-field__value">
                                {getPaymentMethodLabel(p.paymentMethod)}
                              </div>
                            </div>
                            <div className="ph-grid__item">
                              <div className="pm-field__label">
                                Monto pagado
                              </div>
                              <div className="ph-field__value">
                                {formatCurrency(p.amount)}
                              </div>
                            </div>
                            <div className="ph-grid__item">
                              <div className="pm-field__label">Referencia</div>
                              <div className="ph-field__value">
                                {p.reference ?? "—"}
                              </div>
                            </div>
                            <div className="ph-grid__item ph-grid__item--full">
                              <div className="pm-field__label">
                                Observaciones
                              </div>
                              <div className="ph-field__value">
                                {p.notes ?? "—"}
                              </div>
                            </div>
                          </div>

                          <div className="ph-payment-actions">
                            {p.hasReceipt ? (
                              <button
                                className="ph-download-btn"
                                onClick={() =>
                                  handleDownloadReceipt(p.id, p.periods)
                                }
                                disabled={loadingReceipt === p.id}
                                type="button"
                              >
                                <DownloadIcon />
                                <span>
                                  {loadingReceipt === p.id
                                    ? "Descargando..."
                                    : "Descargar comprobante"}
                                </span>
                              </button>
                            ) : (
                              <span style={{ color: "#888" }}>
                                Sin comprobante
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
