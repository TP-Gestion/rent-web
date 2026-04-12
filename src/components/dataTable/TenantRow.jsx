import { AVATAR_COLORS, BADGE_STYLES } from "./dataTable.constants";
import { formatArsAmount, getInitials } from "./dataTable.utils";

function StatusBadge({ status }) {
  const style = BADGE_STYLES[status] || BADGE_STYLES.pendiente;

  return (
    <span className="status-badge" style={{ "--badge-color": style.color, "--badge-bg": style.bg }}>
      {style.label}
    </span>
  );
}

function Avatar({ name }) {
  const index = name.charCodeAt(0) % AVATAR_COLORS.length;
  const { bg, color } = AVATAR_COLORS[index];

  return (
    <div className="avatar" style={{ "--avatar-bg": bg, "--avatar-color": color }} aria-hidden="true">
      {getInitials(name)}
    </div>
  );
}

export default function TenantRow({ tenant, onVerDetalle }) {
  const isOverdue = tenant.status === "vencido";

  return (
    <tr className="tenant-row">
      <td className="tenant-row__cell tenant-row__tenant-cell">
        <div className="tenant-row__tenant-wrap">
          <Avatar name={tenant.name} />
          <div>
            <div className="tenant-row__name">{tenant.name}</div>
            <div className="tenant-row__id">ID: {tenant.id}</div>
          </div>
        </div>
      </td>

      <td className="tenant-row__cell">
        <div className="tenant-row__property">{tenant.property}</div>
        <div className="tenant-row__property-type">{tenant.propertyType}</div>
      </td>

      <td className="tenant-row__cell">
        <StatusBadge status={tenant.status} />
      </td>

      <td className="tenant-row__cell">
        <div className={`tenant-row__due-date${isOverdue ? " tenant-row__due-date--overdue" : ""}`}>
          {tenant.dueDate}
        </div>
      </td>

      <td className="tenant-row__cell tenant-row__cell--right">
        <div className="tenant-row__amount">{formatArsAmount(tenant.amount)}</div>
      </td>

      <td className="tenant-row__cell tenant-row__cell--right">
        <button
          onClick={() => onVerDetalle && onVerDetalle(tenant)}
          className="tenant-row__detail-btn"
        >
          VER DETALLE
        </button>
      </td>
    </tr>
  );
}