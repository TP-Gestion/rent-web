import type { PropiedadDetalle } from "../../services/propertyService";

interface Props {
  detalle: PropiedadDetalle;
  onBack: () => void;
}

const ESTADO_LABEL: Record<string, string> = {
  AL_DIA: "Al día",
  ADEUDADO: "Adeudado",
  LIBRE: "Libre",
};

export default function DetailHeader({ detalle, onBack }: Props) {
  const badgeClass = `pd-status-badge pd-status-badge--${detalle.estado.toLowerCase()}`;

  return (
    <div>
      <button className="pd-back-btn" onClick={onBack} type="button">
        ← Propiedades
      </button>
      <div className="pd-header">
        <div className="pd-header__left">
          <span className={badgeClass}>
            <span className="pd-status-dot" />
            {ESTADO_LABEL[detalle.estado] ?? detalle.estado}
          </span>
          <h1 className="pd-title">
            {detalle.direccion}, {detalle.piso}
          </h1>
          <span className="pd-subtitle">{detalle.edificio}</span>
        </div>
        <div className="pd-header__right">
          <button className="pd-btn pd-btn--primary" type="button">
            Emitir Factura
          </button>
          <button className="pd-btn pd-btn--secondary" type="button">
            Notificar Inquilino
          </button>
        </div>
      </div>
    </div>
  );
}
