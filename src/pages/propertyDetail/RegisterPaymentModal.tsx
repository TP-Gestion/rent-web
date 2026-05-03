import { useState, useEffect } from "react";
import type {
  Billing,
  PaymentMethod,
  RegisterPaymentRequest,
} from "../../service/propiedades";
import { formatCurrency } from "../../utils/propertyDetail";
import {
  registrarPagoSchema,
  type RegisterPaymentFormErrors,
} from "../../schemas/registrarPagoSchema";
import MultiSelect from "../../components/ui/MultiSelect";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  facturas: Billing[];
  isLoadingFacturas: boolean;
  onSubmit: (data: RegisterPaymentRequest) => void;
  isPending: boolean;
}

const MEDIO_OPTIONS: { value: PaymentMethod; label: string }[] = [
  { value: "BANK_TRANSFER", label: "Transferencia bancaria" },
  { value: "CASH", label: "Efectivo" },
  { value: "CHECK", label: "Cheque" },
  { value: "DEBIT", label: "Débito automático" },
  { value: "CREDIT", label: "Tarjeta de crédito" },
];

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

export default function RegisterPaymentModal({
  isOpen,
  onClose,
  facturas,
  isLoadingFacturas,
  onSubmit,
  isPending,
}: Props) {
  const [selectedPeriods, setSelectedPeriods] = useState<string[]>([]);
  const [fechaPago, setFechaPago] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [medioPago, setMedioPago] = useState<PaymentMethod | "">("");
  const [referencia, setReferencia] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [errors, setErrors] = useState<RegisterPaymentFormErrors>({});

  const montoTotal = facturas
    .filter((f) => selectedPeriods.includes(f.period))
    .reduce((acc, f) => acc + f.amount, 0);

  useEffect(() => {
    if (isOpen) {
      setSelectedPeriods([]);
      setFechaPago(new Date().toISOString().slice(0, 10));
      setMedioPago("");
      setReferencia("");
      setObservaciones("");
      setErrors({});
    }
  }, [isOpen]);

  useEffect(() => {
    setFechaPago(new Date().toISOString().slice(0, 10));
    setErrors((prev) => ({ ...prev, paymentDate: undefined }));
  }, [selectedPeriods]);

  if (!isOpen) return null;

  const today = new Date().toISOString().slice(0, 10);

  const minFechaPago =
    selectedPeriods.length > 0
      ? facturas
          .filter((f) => selectedPeriods.includes(f.period))
          .map((f) => f.dueDate)
          .sort()
          .slice(-1)[0]
      : undefined;

  const handleSubmit = () => {
    const result = registrarPagoSchema.safeParse({
      periods: selectedPeriods,
      paymentDate: fechaPago,
      paymentMethod: medioPago,
      reference: referencia,
      notes: observaciones,
    });

    const newErrors: RegisterPaymentFormErrors = {};

    if (!result.success) {
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof RegisterPaymentFormErrors;
        if (!newErrors[key]) newErrors[key] = issue.message;
      }
    }

    if (fechaPago && fechaPago > today) {
      newErrors.paymentDate = "La fecha de pago no puede ser futura";
    } else if (minFechaPago && fechaPago < minFechaPago) {
      newErrors.paymentDate = `La fecha de pago no puede ser anterior al vencimiento (${minFechaPago})`;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const {
      periods,
      paymentMethod: method,
      reference: ref,
      notes: note,
    } = result.data!;
    onSubmit({
      amount: montoTotal,
      paymentMethod: method as PaymentMethod,
      paymentDate: fechaPago,
      reference: ref || undefined,
      notes: note || undefined,
      selectedPeriods: periods,
    });
  };

  const noSelectableFact =
    facturas.filter((f) => f.status !== "PAID").length === 0;

  return (
    <div className="pm-overlay" onClick={onClose}>
      <div className="pm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="pm-modal__header">
          <h2 className="pm-modal__title">Registrar Pago</h2>
          <button
            className="pm-modal__close"
            onClick={onClose}
            type="button"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <div className="pm-modal__body">
          <div className="pm-section">
            <div className="pm-section__label">Períodos a incluir</div>
            {isLoadingFacturas ? (
              <div className="pm-feedback">Cargando facturas...</div>
            ) : (
              <MultiSelect
                options={facturas.map((f) => ({
                  value: f.period,
                  label: f.period,
                  sublabel: formatCurrency(f.amount),
                  disabled: f.status === "PAID",
                  badge: (
                    <span
                      className={`pd-pay-status ${ESTADO_CSS[f.status] ?? ""}`}
                    >
                      {ESTADO_LABEL[f.status] ?? f.status}
                    </span>
                  ),
                }))}
                value={selectedPeriods}
                onChange={(vals) => {
                  setSelectedPeriods(vals);
                  if (errors.periods)
                    setErrors((e) => ({ ...e, periods: undefined }));
                }}
                placeholder="Seleccioná los períodos a pagar"
                hasError={!!errors.periods}
              />
            )}
            {errors.periods && (
              <p className="pm-field__error">{errors.periods}</p>
            )}
          </div>

          <div className="pm-section">
            <div className="pm-section__label">Datos del pago</div>

            <div className="pm-field">
              <label className="pm-field__label">Monto total</label>
              <input
                className="pm-field__input pm-field__input--readonly"
                type="text"
                value={
                  selectedPeriods.length === 0
                    ? "—"
                    : formatCurrency(montoTotal)
                }
                disabled
                readOnly
              />
            </div>

            <div className="pm-field">
              <label className="pm-field__label">
                Fecha de pago <span className="pm-required">*</span>
              </label>
              <input
                className={`pm-field__input${errors.paymentDate ? " pm-field__input--error" : ""}`}
                type="date"
                value={fechaPago}
                max={today}
                min={minFechaPago}
                onChange={(e) => {
                  setFechaPago(e.target.value);
                  if (errors.paymentDate)
                    setErrors((prev) => ({ ...prev, paymentDate: undefined }));
                }}
              />
              {errors.paymentDate && (
                <p className="pm-field__error">{errors.paymentDate}</p>
              )}
            </div>

            <div className="pm-field">
              <label className="pm-field__label">
                Medio de pago <span className="pm-required">*</span>
              </label>
              <select
                className={`pm-field__input${errors.paymentMethod ? " pm-field__input--error" : ""}`}
                value={medioPago}
                onChange={(e) => {
                  setMedioPago(e.target.value as PaymentMethod);
                  if (errors.paymentMethod)
                    setErrors((prev) => ({
                      ...prev,
                      paymentMethod: undefined,
                    }));
                }}
              >
                <option value="">Seleccioná un medio de pago</option>
                {MEDIO_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {errors.paymentMethod && (
                <p className="pm-field__error">{errors.paymentMethod}</p>
              )}
            </div>

            <div className="pm-field">
              <label className="pm-field__label">Referencia</label>
              <input
                className="pm-field__input"
                type="text"
                placeholder="Nro. de transferencia, cheque, etc."
                value={referencia}
                onChange={(e) => setReferencia(e.target.value)}
              />
            </div>

            <div className="pm-field">
              <label className="pm-field__label">Observaciones</label>
              <textarea
                className="pm-field__input pm-field__input--textarea"
                placeholder="Notas adicionales sobre el pago"
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </div>

        <div className="pm-modal__footer">
          <button
            className="pd-btn pd-btn--secondary"
            type="button"
            onClick={onClose}
            disabled={isPending}
          >
            Cancelar
          </button>
          <button
            className="pd-btn pd-btn--primary"
            type="button"
            onClick={handleSubmit}
            disabled={isPending || isLoadingFacturas || noSelectableFact}
          >
            {isPending ? "Registrando..." : "Confirmar pago"}
          </button>
        </div>
      </div>
    </div>
  );
}
