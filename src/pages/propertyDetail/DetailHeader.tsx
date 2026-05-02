import type { PropiedadDetalle } from "../../service/propiedades";

interface Props {
  detalle: PropiedadDetalle;
  onBack: () => void;
  onRegistrarPago?: () => void;
}

export default function DetailHeader({
  detalle,
  onBack,
  onRegistrarPago,
}: Props) {
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
          {detalle.estadoOcupacion === "OCUPADO" && onRegistrarPago && (
            <button
              className="pd-btn pd-btn--primary"
              type="button"
              onClick={onRegistrarPago}
            >
              Registrar pago
            </button>
          )}
          <button className="pd-btn pd-btn--secondary" type="button">
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
