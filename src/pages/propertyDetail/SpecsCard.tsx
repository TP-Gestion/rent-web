import type { PropiedadDetalle } from "../../service/propiedades";

interface Props {
  detalle: PropiedadDetalle;
}

export default function SpecsCard({ detalle }: Props) {
  return (
    <div className="pd-card">
      <h2 className="pd-card__title">Especificaciones</h2>
      <div className="pd-specs__grid">
        <div className="pd-specs__item">
          <span className="pd-specs__item-val">{detalle.ambientes}</span>
          <span className="pd-specs__item-lbl">Ambientes</span>
        </div>
        <div className="pd-specs__item">
          <span className="pd-specs__item-val">{detalle.superficie}</span>
          <span className="pd-specs__item-lbl">m²</span>
        </div>
      </div>
    </div>
  );
}
