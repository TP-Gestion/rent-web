import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import type { Tenant, TenantStatus } from "../services/expensasService";
import {
  BUILDING_OPTIONS,
  COL_HEADERS,
  TABS,
  filterTenants,
  formatArsAmount,
  getInitials,
  PER_PAGE,
} from "../services/expensasService";
import styles from "./ExpensasDataTable.module.css";

const BADGE_STYLES: Record<TenantStatus, { bg: string; color: string; label: string }> = {
  pagado: { bg: "#eaf6ef", color: "#2e7d4f", label: "PAGADO" },
  pendiente: { bg: "#fff8e6", color: "#9A6F00", label: "PENDIENTE" },
  vencido: { bg: "#fdf0f0", color: "#a33030", label: "VENCIDO" },
};

const AVATAR_COLORS = [
  { bg: "#e6f1fb", color: "#185FA5" },
  { bg: "#fff8e6", color: "#9A6F00" },
  { bg: "#fdf0f0", color: "#a33030" },
  { bg: "#eaf6ef", color: "#2e7d4f" },
  { bg: "#f3e6fb", color: "#6a3a9a" },
];

interface DataTableProps {
  tenants: Tenant[];
  perPage?: number;
  onVerDetalle?: (tenant: Tenant) => void;
}

function StatusBadge({ status }: { status: TenantStatus }) {
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

function Avatar({ name }: { name: string }) {
  const index = name.charCodeAt(0) % AVATAR_COLORS.length;
  const { bg, color } = AVATAR_COLORS[index];

  return (
    <div
      className={styles.avatar}
      style={{ "--avatar-bg": bg, "--avatar-color": color } as CSSProperties}
      aria-hidden="true"
    >
      {getInitials(name)}
    </div>
  );
}

function TabFilter({ activeTab, onChange }: { activeTab: string; onChange: (tab: string) => void }) {
  return (
    <div className={styles.tabs} role="tablist" aria-label="Filtrar por estado">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key;

        return (
          <button
            key={tab.key}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.key)}
            className={`${styles.tabButton} ${isActive ? styles.tabButtonActive : ""}`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

function BuildingFilter({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className={styles.buildingFilter}>
      <span className={styles.buildingLabel}>FILTRAR POR EDIFICIO</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label="Filtrar por edificio"
        className={styles.buildingSelect}
      >
        {BUILDING_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function TenantRow({ tenant, onVerDetalle }: { tenant: Tenant; onVerDetalle?: (tenant: Tenant) => void }) {
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

function Pagination({ currentPage, totalPages, totalResults, perPage, onChange }: {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  perPage: number;
  onChange: (page: number) => void;
}) {
  const from = totalResults === 0 ? 0 : (currentPage - 1) * perPage + 1;
  const to = totalResults === 0 ? 0 : Math.min(currentPage * perPage, totalResults);

  const pages: number[] = [];
  const maxVisible = 3;
  for (let page = 1; page <= Math.min(maxVisible, totalPages); page += 1) {
    pages.push(page);
  }

  return (
    <div className={styles.paginationWrap}>
      <div className={styles.pagination} role="navigation" aria-label="Paginación">
        <span className={styles.summary}>
          Mostrando {from}-{to} de {totalResults} resultados
        </span>
        <div className={styles.paginationControls}>
          <button
            onClick={() => onChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`${styles.paginationButton} ${currentPage === 1 ? styles.paginationButtonDisabled : ""}`}
            aria-label="Página anterior"
          >
            ‹
          </button>

          {pages.map((page) => (
            <button
              key={page}
              onClick={() => onChange(page)}
              className={`${styles.paginationButton} ${page === currentPage ? styles.paginationButtonActive : ""}`}
              aria-label={`Página ${page}`}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </button>
          ))}

          {totalPages > maxVisible && <span className={styles.ellipsis}>…</span>}

          <button
            onClick={() => onChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className={`${styles.paginationButton} ${currentPage === totalPages ? styles.paginationButtonDisabled : ""}`}
            aria-label="Página siguiente"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ExpensasDataTable({ tenants, perPage = PER_PAGE, onVerDetalle }: DataTableProps) {
  const [activeTab, setActiveTab] = useState("todos");
  const [building, setBuilding] = useState("todos");
  const [page, setPage] = useState(1);

  const filteredTenants = useMemo(
    () => filterTenants(tenants, { tab: activeTab, building }),
    [tenants, activeTab, building],
  );

  const totalResults = filteredTenants.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / perPage));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * perPage;
  const visibleTenants = filteredTenants.slice(start, start + perPage);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setPage(1);
  };

  const handleBuildingChange = (nextBuilding: string) => {
    setBuilding(nextBuilding);
    setPage(1);
  };

  return (
    <div className={styles.table}>
      <div className={styles.controls}>
        <TabFilter activeTab={activeTab} onChange={handleTabChange} />
        <BuildingFilter value={building} onChange={handleBuildingChange} />
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.tableEl} aria-label="Tabla de expensas de inquilinos">
          <thead>
            <tr className={styles.headRow}>
              {COL_HEADERS.map((column) => (
                <th
                  key={column}
                  className={`${styles.headCell} ${column === "Monto" || column === "Acción" ? styles.headCellRight : ""}`}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleTenants.length === 0 ? (
              <tr>
                <td colSpan={COL_HEADERS.length} className={styles.empty}>
                  No se encontraron resultados
                </td>
              </tr>
            ) : (
              visibleTenants.map((tenant) => (
                <TenantRow key={tenant.id} tenant={tenant} onVerDetalle={onVerDetalle} />
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalResults={totalResults}
        perPage={perPage}
        onChange={setPage}
      />
    </div>
  );
}