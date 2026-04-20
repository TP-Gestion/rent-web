import type { PropiedadDetalle } from "../../service/propiedades";

interface Props {
  detalle: PropiedadDetalle;
  onBack: () => void;
}

export default function DetailHeader({ detalle, onBack }: Props) {
  return (
    <div>
      <button className="pd-back-btn" onClick={onBack} type="button">
        ← Propiedades
      </button>
      <div className="pd-header">
        <div className="pd-header__left">
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
