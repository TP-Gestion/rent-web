import type { CSSProperties } from "react";
import type { Tenant, TenantStatus } from "../../types/expensas";
import { formatArsAmount, getInitials } from "../../services/expensasService";
import { AVATAR_COLORS, BADGE_STYLES } from "../../mocks/dataTable";
import styles from "../ExpensasDataTable.module.css";

interface StatusBadgeProps {
  status: TenantStatus;
}

interface AvatarProps {
  name: string;
}

interface TenantRowProps {
  tenant: Tenant;
  onVerDetalle?: (tenant: Tenant) => void;
}

function StatusBadge({ status }: StatusBadgeProps) {
  const style = BADGE_STYLES[status] ?? BADGE_STYLES.pendiente;

  return (
    <span
      className={styles.statusBadge}
      style={{ "--badge-color": style.color, "--badge-bg": style.bg } as CSSProperties}
    >
      {style.label}
    </span>
  );
}

function Avatar({ name }: AvatarProps) {
  const safeName = name.trim();
  const index = safeName.length > 0 ? safeName.charCodeAt(0) % AVATAR_COLORS.length : 0;
  const { bg, color } = AVATAR_COLORS[index];

  return (
    <div
      className={styles.avatar}
      style={{ "--avatar-bg": bg, "--avatar-color": color } as CSSProperties}
      aria-hidden="true"
    >
      {getInitials(safeName)}
    </div>
  );
}

export default function TenantRow({ tenant, onVerDetalle }: TenantRowProps) {
  const isOverdue = tenant.status === "vencido";

  return (
    <tr className={styles.row}>
      <td className={`${styles.cell} ${styles.tenantCell}`}>
        <div className={styles.tenantWrap}>
          <Avatar name={tenant.name} />
          <div>
            <div className={styles.name}>{tenant.name}</div>
            <div className={styles.id}>ID: {tenant.id}</div>
          </div>
        </div>
      </td>

      <td className={styles.cell}>
        <div className={styles.property}>{tenant.property}</div>
        <div className={styles.propertyType}>{tenant.propertyType}</div>
      </td>

      <td className={styles.cell}>
        <StatusBadge status={tenant.status} />
      </td>

      <td className={styles.cell}>
        <div className={`${styles.dueDate} ${isOverdue ? styles.overdue : ""}`}>{tenant.dueDate}</div>
      </td>

      <td className={styles.cell}>
        <div className={styles.amount}>{formatArsAmount(tenant.amount)}</div>
      </td>

      <td className={styles.cell}>
        <button onClick={() => onVerDetalle && onVerDetalle(tenant)} className={styles.detailBtn}>
          VER DETALLE
        </button>
      </td>
    </tr>
  );
}
