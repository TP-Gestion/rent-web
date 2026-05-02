import { useState, useEffect } from "react";
import type {
  Factura,
  MedioPago,
  RegistrarPagoRequest,
} from "../../service/propiedades";
import { formatCurrency } from "../../utils/propertyDetail";
import {
  registrarPagoSchema,
  type RegistrarPagoFormErrors,
} from "../../schemas/registrarPagoSchema";
import MultiSelect from "../../components/ui/MultiSelect";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  facturas: Factura[];
  isLoadingFacturas: boolean;
  onSubmit: (data: RegistrarPagoRequest) => void;
  isPending: boolean;
}

const MEDIO_OPTIONS: { value: MedioPago; label: string }[] = [
  { value: "TRANSFERENCIA", label: "Transferencia bancaria" },
  { value: "EFECTIVO", label: "Efectivo" },
  { value: "CHEQUE", label: "Cheque" },
  { value: "DEBITO", label: "Débito automático" },
  { value: "CREDITO", label: "Tarjeta de crédito" },
];

const ESTADO_LABEL: Record<string, string> = {
  PAGADO: "Pagado",
  PENDIENTE: "Pendiente",
  VENCIDO: "Vencido",
};

const ESTADO_CSS: Record<string, string> = {
  PAGADO: "pd-pay-status--pagado",
  PENDIENTE: "pd-pay-status--parcial",
  VENCIDO: "pd-pay-status--adeudado",
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
  const [medioPago, setMedioPago] = useState<MedioPago | "">("");
  const [referencia, setReferencia] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [errors, setErrors] = useState<RegistrarPagoFormErrors>({});

  const montoTotal = facturas
    .filter((f) => selectedPeriods.includes(f.periodo))
    .reduce((acc, f) => acc + f.monto, 0);

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
    setErrors((prev) => ({ ...prev, fechaPago: undefined }));
  }, [selectedPeriods]);

  if (!isOpen) return null;

  const today = new Date().toISOString().slice(0, 10);

  const minFechaPago =
    selectedPeriods.length > 0
      ? facturas
          .filter((f) => selectedPeriods.includes(f.periodo))
          .map((f) => f.fechaVencimiento)
          .sort()
          .slice(-1)[0]
      : undefined;

  const handleSubmit = () => {
    const result = registrarPagoSchema.safeParse({
      periodos: selectedPeriods,
      fechaPago,
      medioPago,
      referencia,
      observaciones,
    });

    const newErrors: RegistrarPagoFormErrors = {};

    if (!result.success) {
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof RegistrarPagoFormErrors;
        if (!newErrors[key]) newErrors[key] = issue.message;
      }
    }

    if (fechaPago && fechaPago > today) {
      newErrors.fechaPago = "La fecha de pago no puede ser futura";
    } else if (minFechaPago && fechaPago < minFechaPago) {
      newErrors.fechaPago = `La fecha de pago no puede ser anterior al vencimiento (${minFechaPago})`;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const {
      periodos,
      medioPago: medio,
      referencia: ref,
      observaciones: obs,
    } = result.data!;
    onSubmit({
      monto: montoTotal,
      medioPago: medio as MedioPago,
      fechaPago,
      referencia: ref || undefined,
      observaciones: obs || undefined,
      periodosSeleccionados: periodos,
    });
  };

  const noSelectableFact =
    facturas.filter((f) => f.estado !== "PAGADO").length === 0;

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
                  value: f.periodo,
                  label: f.periodo,
                  sublabel: formatCurrency(f.monto),
                  disabled: f.estado === "PAGADO",
                  badge: (
                    <span
                      className={`pd-pay-status ${ESTADO_CSS[f.estado] ?? ""}`}
                    >
                      {ESTADO_LABEL[f.estado] ?? f.estado}
                    </span>
                  ),
                }))}
                value={selectedPeriods}
                onChange={(vals) => {
                  setSelectedPeriods(vals);
                  if (errors.periodos)
                    setErrors((e) => ({ ...e, periodos: undefined }));
                }}
                placeholder="Seleccioná los períodos a pagar"
                hasError={!!errors.periodos}
              />
            )}
            {errors.periodos && (
              <p className="pm-field__error">{errors.periodos}</p>
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
                className={`pm-field__input${errors.fechaPago ? " pm-field__input--error" : ""}`}
                type="date"
                value={fechaPago}
                max={today}
                min={minFechaPago}
                onChange={(e) => {
                  setFechaPago(e.target.value);
                  if (errors.fechaPago)
                    setErrors((prev) => ({ ...prev, fechaPago: undefined }));
                }}
              />
              {errors.fechaPago && (
                <p className="pm-field__error">{errors.fechaPago}</p>
              )}
            </div>

            <div className="pm-field">
              <label className="pm-field__label">
                Medio de pago <span className="pm-required">*</span>
              </label>
              <select
                className={`pm-field__input${errors.medioPago ? " pm-field__input--error" : ""}`}
                value={medioPago}
                onChange={(e) => {
                  setMedioPago(e.target.value as MedioPago);
                  if (errors.medioPago)
                    setErrors((prev) => ({ ...prev, medioPago: undefined }));
                }}
              >
                <option value="">Seleccioná un medio de pago</option>
                {MEDIO_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {errors.medioPago && (
                <p className="pm-field__error">{errors.medioPago}</p>
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
