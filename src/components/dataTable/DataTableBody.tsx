import type { PropiedadListItem } from "../../service/propiedades";
import TenantRow from "./TenantRow";

interface DataTableBodyProps {
  headers: string[];
  items: PropiedadListItem[];
  onVerDetalle?: (item: PropiedadListItem) => void;
}

export default function DataTableBody({
  headers,
  items,
  onVerDetalle,
}: DataTableBodyProps) {
  return (
    <div className="data-table__table-wrap">
      <table
        className="data-table__table"
        aria-label="Tabla de expensas de inquilinos"
      >
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
          {items.length === 0 ? (
            <tr>
              <td colSpan={headers.length} className="data-table__empty">
                No se encontraron resultados
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <TenantRow
                key={item.id}
                item={item}
                onVerDetalle={onVerDetalle}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
