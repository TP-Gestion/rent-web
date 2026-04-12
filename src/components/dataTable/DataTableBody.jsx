import TenantRow from "./TenantRow";

export default function DataTableBody({ headers, tenants, onVerDetalle }) {
  return (
    <div className="data-table__table-wrap">
      <table className="data-table__table" aria-label="Tabla de expensas de inquilinos">
        <thead>
          <tr className="data-table__head-row">
            {headers.map((column) => (
              <th
                key={column}
                className={`data-table__head-cell${column === "Monto" || column === "Acción" ? " data-table__head-cell--right" : ""}`}
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tenants.length === 0 ? (
            <tr>
              <td colSpan={headers.length} className="data-table__empty">
                No se encontraron resultados
              </td>
            </tr>
          ) : (
            tenants.map((tenant) => (
              <TenantRow key={tenant.id} tenant={tenant} onVerDetalle={onVerDetalle} />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}