import { useState, useMemo, useEffect } from "react";
import {
  crearPropiedadSchema,
  FormValues,
} from "../schemas/crearPropiedadSchema";
import { useNavigate } from "react-router";
import {
  InputField,
  SelectField,
  Toggle,
} from "../components/formFields/FormFields";
import { useCrearPropiedad } from "../hooks/useCrearPropiedad";
import "./NuevaPropiedadPage.css";
import z from "zod";

const TIPO_OPTIONS = [
  { value: "departamento", label: "Departamento" },
  { value: "casa", label: "Casa" },
  { value: "oficina", label: "Oficina" },
  { value: "local", label: "Local comercial" },
];

const INITIAL_VALUES: FormValues = {
  direccion: "",
  edificio: "",
  piso: "",
  superficie: "",
  ambientes: "",
  montoAlquiler: "",
  expensas: "",
  tipoUnidad: "",
  enAlquiler: false,
  nombreInquilino: "",
  apellidoInquilino: "",
  correoInquilino: "",
};

function extractErrors(result: z.SafeParseReturnType<FormValues, FormValues>) {
  const errs: Partial<Record<keyof FormValues, string>> = {};
  if (result.success) return errs;
  result.error.issues.forEach((issue: any) => {
    const key = issue.path[0] as keyof FormValues;
    if (key && !errs[key]) errs[key] = issue.message;
  });
  return errs;
}

const PropiedadCreadaFeedback = ({
  edificio,
  piso,
  handleReset,
}: {
  edificio: string;
  piso: string;
  handleReset: () => void;
}) => {
  const navigate = useNavigate();
  return (
    <div className="np-page">
      <div>
        <div className="np-page__section-label">Administración de Cartera</div>
        <h1 className="np-page__title">Nueva Propiedad</h1>
      </div>
      <div className="np-card">
        <div className="np-success">
          <div className="np-success__icon">✓</div>
          <h2 className="np-success__title">Propiedad registrada</h2>
          <p className="np-success__subtitle">
            {`La unidad ${edificio.toUpperCase()} | ${piso.toUpperCase()} fue integrada al portafolio correctamente.`}
          </p>
          <div className="np-success__actions">
            <button className="np-btn np-btn--secondary" onClick={handleReset}>
              Registrar otra
            </button>
            <button
              className="np-btn np-btn--primary"
              onClick={() => navigate("/")}
            >
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const isExistingPropertyError = (
  data?: { errors: { code: string }[] } | undefined,
) => data?.errors?.some((e) => e.code === "PROP001");

export default function NuevaPropiedadPage() {
  const navigate = useNavigate();
  const mutation = useCrearPropiedad();

  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormValues, string>>
  >({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof FormValues, boolean>>
  >({});

  const isValid = useMemo(
    () => crearPropiedadSchema.safeParse(values).success,
    [values],
  );

  useEffect(() => {
    if (!mutation.isSuccess) return;
    if (isExistingPropertyError(mutation.data)) {
      const msg = "Revisá este campo.";
      setErrors((prev) => ({ ...prev, edificio: msg, piso: msg }));
      setTouched((prev) => ({ ...prev, edificio: true, piso: true }));
    }
  }, [mutation.isSuccess, mutation.data]);

  const change = (field: keyof FormValues, value: string | boolean) => {
    const next = { ...values, [field]: value };
    setValues(next);
    if (touched[field]) {
      const result = crearPropiedadSchema.safeParse(next);
      const errs = extractErrors(result);
      setErrors((prev) => ({ ...prev, [field]: errs[field] }));
    }
  };

  const blur = (field: keyof FormValues) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const result = crearPropiedadSchema.safeParse(values);
    const errs = extractErrors(result);
    setErrors((prev) => ({ ...prev, [field]: errs[field] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = crearPropiedadSchema.safeParse(values);
    if (!result.success) {
      const errs = extractErrors(result);
      setErrors(errs);
      const allTouched = Object.keys(values).reduce<
        Partial<Record<keyof FormValues, boolean>>
      >((acc, k) => ({ ...acc, [k]: true }), {});
      setTouched(allTouched);
      return;
    }
    const { enAlquiler, montoAlquiler, expensas, ambientes, ...rest } =
      result.data;
    mutation.mutate({
      ...rest,
      ambientes: Number(ambientes),
      ...(montoAlquiler ? { montoAlquiler: Number(montoAlquiler) } : {}),
      ...(expensas ? { expensas: Number(expensas) } : {}),
      ...(!enAlquiler
        ? {
            nombreInquilino: undefined,
            apellidoInquilino: undefined,
            correoInquilino: undefined,
          }
        : {}),
    });
  };

  const handleReset = () => {
    setValues(INITIAL_VALUES);
    setErrors({});
    setTouched({});
    mutation.reset();
  };

  const showExistingPropertyMessage =
    mutation.isSuccess && isExistingPropertyError(mutation.data);
  const hasApiErrors = (mutation.data?.errors?.length ?? 0) > 0;
  const isSuccess = mutation.isSuccess && !hasApiErrors;

  if (isSuccess) {
    return (
      <PropiedadCreadaFeedback
        edificio={values.edificio}
        piso={values.piso}
        handleReset={handleReset}
      />
    );
  }

  const errorMessage = mutation.isError
    ? ((mutation.error as Error)?.message ?? "Error inesperado del servidor.")
    : showExistingPropertyMessage
      ? mutation.data!.errors[0].message
      : hasApiErrors
        ? mutation.data!.errors[0].message
        : null;

  return (
    <div className="np-page">
      <div>
        <div className="np-page__section-label">Administración de Cartera</div>
        <h1 className="np-page__title">Nueva Propiedad</h1>
        <p className="np-page__subtitle">
          Registre una unidad inmobiliaria para gestionarla en nombre del
          propietario. Complete los datos para incorporarla al portafolio y
          habilitar su seguimiento de pagos, inquilinos y expensas.
        </p>
      </div>

      <div className="np-card">
        <form className="np-form" onSubmit={handleSubmit} noValidate>
          {(mutation.isError ||
            (hasApiErrors && !showExistingPropertyMessage)) &&
            errorMessage && (
              <div className="np-feedback np-feedback--error" role="alert">
                <span className="np-feedback__icon">✕</span>
                <div>
                  <p className="np-feedback__title">
                    No se pudo registrar la propiedad
                  </p>
                  <p className="np-feedback__body">{errorMessage}</p>
                </div>
              </div>
            )}

          {showExistingPropertyMessage && (
            <div className="np-feedback np-feedback--error" role="alert">
              <span className="np-feedback__icon">✕</span>
              <div>
                <p className="np-feedback__title">Propiedad duplicada</p>
                <p className="np-feedback__body">
                  Ya existe una propiedad registrada para ese piso y edificio.
                  Verifique los datos.
                </p>
              </div>
            </div>
          )}

          <div className="np-section">
            <div className="np-section-title">Datos de la propiedad</div>
            <div className="np-grid-2">
              <InputField
                label="Edificio *"
                placeholder="Ej: Torre Solaris I"
                value={values.edificio}
                onChange={(e) => change("edificio", e.target.value)}
                onBlur={() => blur("edificio")}
                error={errors.edificio}
              />
              <InputField
                label="Piso *"
                placeholder="Ej: 12B"
                value={values.piso}
                onChange={(e) => change("piso", e.target.value)}
                onBlur={() => blur("piso")}
                error={errors.piso}
              />
            </div>
            <InputField
              label="Dirección *"
              placeholder="Dirección completa (Calle, Número, Ciudad)"
              value={values.direccion}
              onChange={(e) => change("direccion", e.target.value)}
              onBlur={() => blur("direccion")}
              error={errors.direccion}
            />
            <div className="np-grid-2">
              <InputField
                label="Superficie (m²) *"
                placeholder="85"
                type="number"
                min="1"
                value={values.superficie}
                onChange={(e) => change("superficie", e.target.value)}
                onBlur={() => blur("superficie")}
                error={errors.superficie}
              />
              <InputField
                label="Ambientes *"
                placeholder="3"
                type="number"
                min="1"
                step="1"
                value={values.ambientes}
                onChange={(e) => change("ambientes", e.target.value)}
                onBlur={() => blur("ambientes")}
                error={errors.ambientes}
              />
            </div>
            <div className="np-grid-2">
              <SelectField
                label="Tipo de unidad *"
                placeholder="Seleccione tipo..."
                options={TIPO_OPTIONS}
                value={values.tipoUnidad}
                onChange={(e) => change("tipoUnidad", e.target.value)}
                onBlur={() => blur("tipoUnidad")}
                error={errors.tipoUnidad}
              />
            </div>
          </div>

          <hr className="np-divider" />

          <div className="np-section">
            <div className="np-section-title">Cobros mensuales</div>
            <div className="np-grid-2">
              <InputField
                label="Alquiler mensual (USD)"
                placeholder="Monto a cobrar al inquilino"
                type="number"
                min="1"
                value={values.montoAlquiler}
                onChange={(e) => change("montoAlquiler", e.target.value)}
                onBlur={() => blur("montoAlquiler")}
                error={errors.montoAlquiler}
              />
              <InputField
                label="Expensas (USD)"
                placeholder="Monto base de servicios comunes"
                type="number"
                min="1"
                value={values.expensas}
                onChange={(e) => change("expensas", e.target.value)}
                onBlur={() => blur("expensas")}
                error={errors.expensas}
              />
            </div>
          </div>

          <hr className="np-divider" />

          <Toggle
            checked={values.enAlquiler}
            onChange={(v) => change("enAlquiler", v)}
            label="Actualmente en alquiler"
          />

          {values.enAlquiler && (
            <div className="np-tenant-section">
              <div className="np-section-title">Datos del inquilino</div>
              <div className="np-grid-2">
                <InputField
                  label="Nombre *"
                  placeholder="Pedro"
                  value={values.nombreInquilino}
                  onChange={(e) => change("nombreInquilino", e.target.value)}
                  onBlur={() => blur("nombreInquilino")}
                  error={errors.nombreInquilino}
                />
                <InputField
                  label="Apellido *"
                  placeholder="Pérez"
                  value={values.apellidoInquilino}
                  onChange={(e) => change("apellidoInquilino", e.target.value)}
                  onBlur={() => blur("apellidoInquilino")}
                  error={errors.apellidoInquilino}
                />
              </div>
              <InputField
                label="Email *"
                placeholder="inquilino@ejemplo.com"
                type="email"
                value={values.correoInquilino}
                onChange={(e) => change("correoInquilino", e.target.value)}
                onBlur={() => blur("correoInquilino")}
                error={errors.correoInquilino}
              />
            </div>
          )}

          <div className="np-actions">
            <button
              type="button"
              className="np-btn np-btn--secondary"
              onClick={() => navigate("/")}
              disabled={mutation.isPending}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="np-btn np-btn--primary"
              disabled={!isValid || mutation.isPending}
            >
              {mutation.isPending ? (
                <>
                  <span className="np-spinner" />
                  Registrando...
                </>
              ) : (
                "Registrar Propiedad"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
