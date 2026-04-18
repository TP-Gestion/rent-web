import { useNavigate } from "react-router";

interface PropertyCreatedFeedbackProps {
  edificio: string;
  piso: string;
  onReset: () => void;
}

export default function PropertyCreatedFeedback({
  edificio,
  piso,
  onReset,
}: PropertyCreatedFeedbackProps) {
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
            <button className="np-btn np-btn--secondary" onClick={onReset}>
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
