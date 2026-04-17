import { useNavigate } from "react-router";
import { InputField, SelectField, Toggle } from "../components/form/FormFields";
import { useAddPropertyForm } from "../hooks/useAddPropertyForm";
import "./AddPropertyPage.module.css";

const isExistingPropertyError = (
  data?: { errors: { code: string }[] } | undefined,
) => data?.errors?.some((e) => e.code === "PROP001");

function PropertyCreatedFeedback({
  edificio,
  piso,
  handleReset,
}: {
  edificio: string;
  piso: string;
  handleReset: () => void;
}) {
  const navigate = useNavigate();

  return (
    <div className="np-page">
      <div>
        <div className="np-page__section-label">Administracion de Cartera</div>
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
}

export default function AddPropertyPage() {
  const navigate = useNavigate();
  const {
    mutation,
    values,
    errors,
    isValid,
    TIPO_OPTIONS,
    handleChange,
    handleBlur,
    handleSubmit,
    handleReset,
  } = useAddPropertyForm();

  const showExistingPropertyMessage = isExistingPropertyError(mutation.data);
  const hasApiErrors = (mutation.data?.errors?.length ?? 0) > 0;
  const isSuccess = mutation.isSuccess && !hasApiErrors;

  if (isSuccess) {
    return (
      <PropertyCreatedFeedback
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
        <div className="np-page__section-label">Administracion de Cartera</div>
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
                onChange={(e) => handleChange("edificio", e.target.value)}
                onBlur={() => handleBlur("edificio")}
                error={errors.edificio}
              />
              <InputField
                label="Piso *"
                placeholder="Ej: 12B"
                value={values.piso}
                onChange={(e) => handleChange("piso", e.target.value)}
                onBlur={() => handleBlur("piso")}
                error={errors.piso}
              />
            </div>
            <InputField
              label="Direccion *"
              placeholder="Direccion completa (Calle, Numero, Ciudad)"
              value={values.direccion}
              onChange={(e) => handleChange("direccion", e.target.value)}
              onBlur={() => handleBlur("direccion")}
              error={errors.direccion}
            />
            <div className="np-grid-2">
              <InputField
                label="Superficie (m2) *"
                placeholder="85"
                type="number"
                min="1"
                value={values.superficie}
                onChange={(e) => handleChange("superficie", e.target.value)}
                onBlur={() => handleBlur("superficie")}
                error={errors.superficie}
              />
              <InputField
                label="Ambientes *"
                placeholder="3"
                type="number"
                min="1"
                step="1"
                value={values.ambientes}
                onChange={(e) => handleChange("ambientes", e.target.value)}
                onBlur={() => handleBlur("ambientes")}
                error={errors.ambientes}
              />
            </div>
            <div className="np-grid-2">
              <SelectField
                label="Tipo de unidad *"
                placeholder="Seleccione tipo..."
                options={TIPO_OPTIONS}
                value={values.tipoUnidad}
                onChange={(e) => handleChange("tipoUnidad", e.target.value)}
                onBlur={() => handleBlur("tipoUnidad")}
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
                onChange={(e) => handleChange("montoAlquiler", e.target.value)}
                onBlur={() => handleBlur("montoAlquiler")}
                error={errors.montoAlquiler}
              />
              <InputField
                label="Expensas (USD)"
                placeholder="Monto base de servicios comunes"
                type="number"
                min="1"
                value={values.expensas}
                onChange={(e) => handleChange("expensas", e.target.value)}
                onBlur={() => handleBlur("expensas")}
                error={errors.expensas}
              />
            </div>
          </div>

          <hr className="np-divider" />

          <Toggle
            checked={values.enAlquiler}
            onChange={(v) => handleChange("enAlquiler", v)}
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
                  onChange={(e) => handleChange("nombreInquilino", e.target.value)}
                  onBlur={() => handleBlur("nombreInquilino")}
                  error={errors.nombreInquilino}
                />
                <InputField
                  label="Apellido *"
                  placeholder="Perez"
                  value={values.apellidoInquilino}
                  onChange={(e) =>
                    handleChange("apellidoInquilino", e.target.value)
                  }
                  onBlur={() => handleBlur("apellidoInquilino")}
                  error={errors.apellidoInquilino}
                />
              </div>
              <InputField
                label="Email *"
                placeholder="inquilino@ejemplo.com"
                type="email"
                value={values.correoInquilino}
                onChange={(e) => handleChange("correoInquilino", e.target.value)}
                onBlur={() => handleBlur("correoInquilino")}
                error={errors.correoInquilino}
              />
              <InputField
                label="Telefono"
                placeholder="Ej: +54 11 4523-8891"
                type="tel"
                value={values.telefonoInquilino}
                onChange={(e) => handleChange("telefonoInquilino", e.target.value)}
                onBlur={() => handleBlur("telefonoInquilino")}
                error={errors.telefonoInquilino}
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
