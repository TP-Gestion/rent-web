import { useState } from "react";
import {
  BUILDING_OPTIONS,
  COL_HEADERS,
} from "./dataTable.constants";
import DataTableBody from "./DataTableBody";
import DataTableFilters from "./DataTableFilters";
import DataTablePagination from "./DataTablePagination";
import "./DataTable.css";

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
      <DataTableFilters
        activeTab={activeTab}
        building={building}
        buildingOptions={BUILDING_OPTIONS}
        onTabChange={handleTabChange}
        onBuildingChange={handleBuildingChange}
      />

      <DataTableBody headers={COL_HEADERS} tenants={tenants} onVerDetalle={onVerDetalle} />

      <DataTablePagination
        currentPage={page}
        totalPages={totalPages}
        totalResults={totalResults}
        perPage={perPage}
        onChange={handlePageChange}
      />
    </div>
  );
}