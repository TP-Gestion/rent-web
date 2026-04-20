import type { PropiedadListItem } from "../../../service/propiedades";
import type { EstadoDisplay } from "./dataTable.constants";
import { AVATAR_COLORS, BADGE_STYLES } from "./dataTable.constants";
import { formatArsAmount, getInitials } from "./dataTable.utils";
import { formatTipoUnidad } from "../../../utils/propertyDetail";

function StatusBadge({ status }: { status: EstadoDisplay }) {
  const style = BADGE_STYLES[status] ?? BADGE_STYLES.PENDIENTE;

  return (
    <span
      className="status-badge"
      style={
        {
          "--badge-color": style.color,
          "--badge-bg": style.bg,
        } as React.CSSProperties
      }
    >
      {style.label}
    </span>
  );
}

function Avatar({ name }: { name: string }) {
  const index = name.charCodeAt(0) % AVATAR_COLORS.length;
  const { bg, color } = AVATAR_COLORS[index];

  return (
    <div
      className="avatar"
      style={
        { "--avatar-bg": bg, "--avatar-color": color } as React.CSSProperties
      }
    >
      {getInitials(name)}
    </div>
  );
}

interface TenantRowProps {
  item: PropiedadListItem;
  onVerDetalle?: (item: PropiedadListItem) => void;
}

export default function TenantRow({ item, onVerDetalle }: TenantRowProps) {
  const isLibre = item.estadoOcupacion === "LIBRE";
  const estadoDisplay: EstadoDisplay = isLibre ? "LIBRE" : item.estadoPago;
  const isOverdue = estadoDisplay === "VENCIDO";

  return (
    <tr className="tenant-row">
      <td className="tenant-row__cell tenant-row__tenant-cell">
        <div className="tenant-row__tenant-wrap">
          {!isLibre && <Avatar name={item.nombreInquilino} />}
          <div>
            <div className="tenant-row__name">
              {isLibre ? "-" : item.nombreInquilino}
            </div>
          </div>
        </div>
      </td>

      <td className="tenant-row__cell">
        <div className="tenant-row__property">
          {item.edificio} - Piso {item.piso}
        </div>
        <div className="tenant-row__property-type">
          {formatTipoUnidad(item.tipoUnidad)}
        </div>
      </td>

      <td className="tenant-row__cell">
        <StatusBadge status={estadoDisplay} />
      </td>

      <td className="tenant-row__cell">
        <div
          className={`tenant-row__due-date${isOverdue ? " tenant-row__due-date--overdue" : ""}`}
        >
          {isLibre ? "-" : (item.fechaVencimiento ?? "—")}
        </div>
      </td>

      <td className="tenant-row__cell tenant-row__cell--right">
        <div className="tenant-row__amount">
          {formatArsAmount(item.montoTotal)}
        </div>
      </td>

      <td className="tenant-row__cell tenant-row__cell--right">
        <button
          onClick={() => onVerDetalle && onVerDetalle(item)}
          className="tenant-row__detail-btn"
        >
          VER DETALLE
        </button>
      </td>
    </tr>
  );
}
