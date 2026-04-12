import { useState } from "react";
import "./DataTable.css";

// ─── StatusBadge ─────────────────────────────────────────────────────────────
const BADGE_STYLES = {
  pagado: { bg: "#eaf6ef", color: "#2e7d4f", label: "PAGADO" },
  pendiente: { bg: "#fff8e6", color: "#9A6F00", label: "PENDIENTE" },
  vencido: { bg: "#fdf0f0", color: "#a33030", label: "VENCIDO" },
};

export function StatusBadge({ status }) {
  const s = BADGE_STYLES[status] || BADGE_STYLES.pendiente;
  return (
    <span className="status-badge" style={{ "--badge-color": s.color, "--badge-bg": s.bg }}>
      {s.label}
    </span>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
const AVATAR_COLORS = [
  { bg: "#e6f1fb", color: "#185FA5" },
  { bg: "#fff8e6", color: "#9A6F00" },
  { bg: "#fdf0f0", color: "#a33030" },
  { bg: "#eaf6ef", color: "#2e7d4f" },
  { bg: "#f3e6fb", color: "#6a3a9a" },
];

function getInitials(name = "") {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

function Avatar({ name }) {
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  const { bg, color } = AVATAR_COLORS[idx];
  return (
    <div className="avatar" style={{ "--avatar-bg": bg, "--avatar-color": color }} aria-hidden="true">
      {getInitials(name)}
    </div>
  );
}

// ─── TabFilter ────────────────────────────────────────────────────────────────
const TABS = [
  { key: "todos", label: "Todos" },
  { key: "pagados", label: "Pagados" },
  { key: "pendientes", label: "Pendientes" },
  { key: "vencidos", label: "Vencidos" },
];

export function TabFilter({ activeTab, onChange }) {
  return (
    <div className="tab-filter" role="tablist" aria-label="Filtrar por estado">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.key)}
            className={`tab-filter__button${isActive ? " tab-filter__button--active" : ""}`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

// ─── BuildingFilter ───────────────────────────────────────────────────────────
export function BuildingFilter({ value, options = [], onChange }) {
  return (
    <div className="building-filter">
      <span className="building-filter__label">
        FILTRAR POR EDIFICIO
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Filtrar por edificio"
        className="building-filter__select"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// ─── TenantRow ────────────────────────────────────────────────────────────────
export function TenantRow({ tenant, onVerDetalle }) {
  const isOverdue = tenant.status === "vencido";

  return (
    <tr className="tenant-row">
      {/* Inquilino */}
      <td className="tenant-row__cell tenant-row__tenant-cell">
        <div className="tenant-row__tenant-wrap">
          <Avatar name={tenant.name} />
          <div>
            <div className="tenant-row__name">
              {tenant.name}
            </div>
            <div className="tenant-row__id">
              ID: {tenant.id}
            </div>
          </div>
        </div>
      </td>

      {/* Propiedad */}
      <td className="tenant-row__cell">
        <div className="tenant-row__property">{tenant.property}</div>
        <div className="tenant-row__property-type">
          {tenant.propertyType}
        </div>
      </td>

      {/* Estado */}
      <td className="tenant-row__cell">
        <StatusBadge status={tenant.status} />
      </td>

      {/* Vencimiento */}
      <td className="tenant-row__cell">
        <div className={`tenant-row__due-date${isOverdue ? " tenant-row__due-date--overdue" : ""}`}>
          {tenant.dueDate}
        </div>
      </td>

      {/* Monto */}
      <td className="tenant-row__cell tenant-row__cell--right">
        <div className="tenant-row__amount">
          {new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(tenant.amount)}
        </div>
      </td>

      {/* Acción */}
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

// ─── Pagination ───────────────────────────────────────────────────────────────
export function Pagination({ currentPage, totalPages, totalResults, perPage = 10, onChange }) {
  const from = (currentPage - 1) * perPage + 1;
  const to = Math.min(currentPage * perPage, totalResults);

  const pages = [];
  const maxVisible = 3;
  for (let i = 1; i <= Math.min(maxVisible, totalPages); i++) {
    pages.push(i);
  }

  return (
    <div className="pagination" role="navigation" aria-label="Paginación">
      <span className="pagination__summary">
        Mostrando {from}-{to} de {totalResults} resultados
      </span>
      <div className="pagination__controls">
        <button
          onClick={() => onChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={`pagination__button${currentPage === 1 ? " pagination__button--disabled" : ""}`}
          aria-label="Página anterior"
        >
          ‹
        </button>
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`pagination__button${p === currentPage ? " pagination__button--active" : ""}`}
            aria-label={`Página ${p}`}
            aria-current={p === currentPage ? "page" : undefined}
          >
            {p}
          </button>
        ))}
        {totalPages > maxVisible && (
          <span className="pagination__ellipsis">…</span>
        )}
        <button
          onClick={() => onChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={`pagination__button${currentPage === totalPages ? " pagination__button--disabled" : ""}`}
          aria-label="Página siguiente"
        >
          ›
        </button>
      </div>
    </div>
  );
}

// ─── DataTable ────────────────────────────────────────────────────────────────
const COL_HEADERS = ["Inquilino", "Propiedad", "Estado", "Vencimiento", "Monto", "Acción"];

const BUILDING_OPTIONS = [
  { value: "todos", label: "Todos los edificios" },
  { value: "torres-este", label: "Torres del Este" },
  { value: "solaris-i", label: "Torre Solaris I" },
  { value: "solaris-ii", label: "Torre Solaris II" },
];

/**
 * DataTable
 * Tabla completa con filtros, filas de inquilinos y paginación.
 *
 * Props:
 *  - tenants        → array de objetos Tenant
 *  - totalResults   → número total de resultados (para la paginación)
 *  - perPage        → resultados por página (default 10)
 *  - onVerDetalle   → callback(tenant) al hacer click en "VER DETALLE"
 *  - onFilterChange → callback({ tab, building, page }) al cambiar cualquier filtro
 */
export default function DataTable({
  tenants,
  totalResults,
  perPage,
  onVerDetalle,
  onFilterChange,
}) {
  const [activeTab, setActiveTab] = useState("todos");
  const [building, setBuilding] = useState("torres-este");
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(totalResults / perPage));

  const notifyChange = (updates) => {
    const state = { tab: activeTab, building, page, ...updates };
    if (onFilterChange) onFilterChange(state);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPage(1);
    notifyChange({ tab, page: 1 });
  };

  const handleBuildingChange = (b) => {
    setBuilding(b);
    setPage(1);
    notifyChange({ building: b, page: 1 });
  };

  const handlePageChange = (p) => {
    setPage(p);
    notifyChange({ page: p });
  };

  return (
    <div className="data-table">
      {/* Controles superiores */}
      <div className="data-table__controls">
        <TabFilter activeTab={activeTab} onChange={handleTabChange} />
        <BuildingFilter
          value={building}
          options={BUILDING_OPTIONS}
          onChange={handleBuildingChange}
        />
      </div>

      {/* Tabla */}
      <div className="data-table__table-wrap">
        <table className="data-table__table" aria-label="Tabla de expensas de inquilinos">
          <thead>
            <tr className="data-table__head-row">
              {COL_HEADERS.map((col) => (
                <th
                  key={col}
                  className={`data-table__head-cell${col === "Monto" || col === "Acción" ? " data-table__head-cell--right" : ""}`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tenants.length === 0 ? (
              <tr>
                <td
                  colSpan={COL_HEADERS.length}
                  className="data-table__empty"
                >
                  No se encontraron resultados
                </td>
              </tr>
            ) : (
              tenants.map((tenant) => (
                <TenantRow
                  key={tenant.id}
                  tenant={tenant}
                  onVerDetalle={onVerDetalle}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="data-table__pagination-wrap">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalResults={totalResults}
          perPage={perPage}
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
}