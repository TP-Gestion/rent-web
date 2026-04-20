import type { PropiedadDetalle } from "../../service/propiedades";
import { getInitials } from "../../utils/propertyDetail";

interface Props {
  detalle: PropiedadDetalle;
}

export default function TenantCard({ detalle }: Props) {
  const hasTenant = detalle.estadoOcupacion === "OCUPADO";

  return (
    <div className="pd-card">
      <h2 className="pd-card__title">Inquilino</h2>
      {hasTenant ? <TenantInfo detalle={detalle} /> : <FreeState />}
    </div>
  );
}

function TenantInfo({ detalle }: Props) {
  const fullName = detalle.nombreInquilino;
  const nameParts = fullName.split(" ");
  const initials = getInitials(nameParts[0] ?? "", nameParts[1] ?? "");

  return (
    <>
      <div className="pd-tenant__head">
        <div className="pd-tenant__avatar">{initials}</div>
        <div>
          <p className="pd-tenant__name">{fullName}</p>
          <span className="pd-tenant__role">Inquilino activo</span>
        </div>
      </div>
      <button
        className="pd-btn pd-btn--secondary pd-tenant__action"
        type="button"
      >
        Ver Perfil Completo
      </button>
    </>
  );
}

function FreeState() {
  return (
    <div className="pd-free">
      <span className="pd-free__icon">🏠</span>
      <p className="pd-free__title">Propiedad libre</p>
      <p className="pd-free__sub">No hay inquilino asignado actualmente.</p>
    </div>
  );
}
