import { useState, useEffect } from "react";
import DataTablePagination from "../tenants/dataTable/DataTablePagination";
import type { BuildingOption } from "../tenants/dataTable/dataTable.constants";
import "../tenants/dataTable/DataTable.css";
import "./BillingTable.css";

export type EstadoAnterior = "PAID" | "OVERDUE" | "PENDING";

export interface BillingItem {
  id: string;
  propiedad: string;
  edificio: string;
  unidad: string;
  inquilino: string;
  correo: string;
  telefono: string;
  direccion: string;
  estadoAnterior: EstadoAnterior;
  deudaAmount?: number;
  montoACobrar: number;
  montoAlquiler: number;
  expensas: number;
  gastos: number;
  fechaVencimiento: string;
  periodo: string;
}

const ESTADO_BADGE: Record<
  EstadoAnterior,
  { label: (deuda?: number) => string; bg: string; color: string }
> = {
  PAID: {
    label: () => "AL DÍA",
    bg: "#e6f6ee",
    color: "#1a6b3a",
  },
  OVERDUE: {
    label: (deuda) => (deuda != null ? `DEUDA: ${formatArs(deuda)}` : "DEUDA"),
    bg: "#fdecea",
    color: "#b02020",
  },
  PENDING: {
    label: () => "PENDIENTE",
    bg: "#fff4d6",
    color: "#8a5a00",
  },
};

function formatArs(amount: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(amount);
}

const PER_PAGE = 5;

interface BillingTableProps {
  items: BillingItem[];
  selectedIds: Set<string>;
  onSelectionChange: (ids: Set<string>) => void;
  buildingOptions?: BuildingOption[];
  currentBuilding?: string;
  onBuildingChange?: (b: string) => void;
}

export default function BillingTable({
  items,
  selectedIds,
  onSelectionChange,
  buildingOptions,
  currentBuilding = "todos",
  onBuildingChange,
}: BillingTableProps) {
  const [page, setPage] = useState(1);

  const visibleItems = items.filter(
    (i) => i.inquilino && i.inquilino.trim() !== "",
  );

  useEffect(() => {
    setPage(1);
  }, [items]);

  const totalPages = Math.max(1, Math.ceil(visibleItems.length / PER_PAGE));
  const pageItems = visibleItems.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const allSelected =
    visibleItems.length > 0 && visibleItems.every((i) => selectedIds.has(i.id));
  const someSelected =
    !allSelected && visibleItems.some((i) => selectedIds.has(i.id));

  const handleSelectAll = () => {
    const next = new Set(selectedIds);
    if (allSelected) {
      visibleItems.forEach((i) => next.delete(i.id));
    } else {
      visibleItems.forEach((i) => next.add(i.id));
    }
    onSelectionChange(next);
  };

  const handleSelectRow = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    onSelectionChange(next);
  };

  return (
    <div className="billing-table data-table">
      {buildingOptions && buildingOptions.length > 1 && (
        <div className="data-table__controls">
          <div className="building-filter">
            <span className="building-filter__label">FILTRAR POR EDIFICIO</span>
            <select
              className="building-filter__select"
              value={currentBuilding}
              onChange={(e) => onBuildingChange?.(e.target.value)}
            >
              {buildingOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="data-table__table-wrap">
        <table className="data-table__table">
          <thead>
            <tr className="data-table__head-row">
              <th className="data-table__head-cell billing-table__check-cell">
                <input
                  type="checkbox"
                  className="billing-table__checkbox"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected;
                  }}
                  onChange={handleSelectAll}
                  aria-label="Seleccionar todas las propiedades"
                />
              </th>
              <th className="data-table__head-cell">Propiedad</th>
              <th className="data-table__head-cell">Inquilino</th>
              <th className="data-table__head-cell">Estado Anterior</th>
              <th className="data-table__head-cell data-table__head-cell--right">
                Monto a Cobrar
              </th>
            </tr>
          </thead>
          <tbody>
            {pageItems.length === 0 ? (
              <tr>
                <td colSpan={5} className="data-table__empty">
                  No hay propiedades con deuda o pago pendiente
                </td>
              </tr>
            ) : (
              pageItems.map((item) => {
                const badge = ESTADO_BADGE[item.estadoAnterior];
                const isSelected = selectedIds.has(item.id);
                return (
                  <tr
                    key={item.id}
                    className={`tenant-row billing-table__row${
                      isSelected ? " billing-table__row--selected" : ""
                    }`}
                    onClick={() => handleSelectRow(item.id)}
                  >
                    <td className="tenant-row__cell billing-table__check-cell">
                      <input
                        type="checkbox"
                        className="billing-table__checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectRow(item.id)}
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`Seleccionar ${item.propiedad}`}
                      />
                    </td>
                    <td className="tenant-row__cell">
                      <div className="tenant-row__name">{item.propiedad}</div>
                    </td>
                    <td className="tenant-row__cell">
                      <div className="billing-table__inquilino">
                        {item.inquilino}
                      </div>
                    </td>
                    <td className="tenant-row__cell">
                      <span
                        className="status-badge"
                        style={
                          {
                            "--badge-color": badge.color,
                            "--badge-bg": badge.bg,
                          } as React.CSSProperties
                        }
                      >
                        {badge.label(item.deudaAmount)}
                      </span>
                    </td>
                    <td className="tenant-row__cell tenant-row__cell--right">
                      <div className="tenant-row__amount">
                        {formatArs(item.montoACobrar)}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <DataTablePagination
        currentPage={page}
        totalPages={totalPages}
        totalResults={items.length}
        perPage={PER_PAGE}
        onChange={setPage}
      />
    </div>
  );
}
