import { COL_HEADERS, PER_PAGE } from "../mocks/expensasDashboard";
import { EMPTY_RESULTS_LABEL } from "../mocks/dataTable";
import type { DataTableProps } from "../types/dataTable";
import { useExpensasTableState } from "../hooks/useExpensasTableState";
import { BuildingFilter, TabFilter } from "./table/TableFilters";
import TenantRow from "./table/TenantRow";
import Pagination from "./table/Pagination";
import styles from "./ExpensasDataTable.module.css";
export default function ExpensasDataTable({ tenants, perPage = PER_PAGE, onVerDetalle }: DataTableProps) {
  const { activeTab, building, currentPage, handleBuildingChange, handleTabChange, setPage, totalPages, totalResults, visibleTenants } =
    useExpensasTableState({ tenants, perPage });

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
                  {EMPTY_RESULTS_LABEL}
                </td>
              </tr>
            ) : (
              visibleTenants.map((tenant) => <TenantRow key={tenant.id} tenant={tenant} onVerDetalle={onVerDetalle} />)
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