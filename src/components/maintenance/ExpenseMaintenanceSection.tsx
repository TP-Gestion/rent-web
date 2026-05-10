import { useMemo, useState, useRef, useEffect } from "react";
import type { Building } from "../../service/propiedades";
import type { CommonExpense } from "../../service/maintenance";
import { useCommonExpenses } from "../../hooks/useCommonExpenses";
import { formatCurrency } from "../../utils/propertyDetail";

interface ExpenseRow extends CommonExpense {
  buildingName: string;
  buildingId: number;
  isEditing?: boolean;
}

interface ExpenseMaintenanceSectionProps {
  buildings: Building[];
}

export default function ExpenseMaintenanceSection({
  buildings,
}: ExpenseMaintenanceSectionProps) {
  const [selectedBuildingId, setSelectedBuildingId] = useState<number | null>(
    buildings.length > 0 ? buildings[0].id : null,
  );
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  const { data: expensesResponse = { data: [], errors: [] }, isLoading: isLoadingExpenses } =
    useCommonExpenses(selectedBuildingId);

  const selectedBuilding = useMemo(
    () => buildings.find((b) => b.id === selectedBuildingId),
    [buildings, selectedBuildingId],
  );

  useEffect(() => {
    if (editingId && editorRef.current) {
      editorRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [editingId]);

  const rows: ExpenseRow[] = useMemo(
    () =>
      (expensesResponse.data || []).map((expense) => ({
        ...expense,
        buildingName: selectedBuilding?.name || "Edificio",
        buildingId: selectedBuildingId || 0,
      })),
    [expensesResponse.data, selectedBuilding?.name, selectedBuildingId],
  );

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const matchesSearch =
        search.trim() === "" ||
        row.description.toLowerCase().includes(search.toLowerCase()) ||
        row.buildingName.toLowerCase().includes(search.toLowerCase());
      return matchesSearch;
    });
  }, [rows, search]);

  const editingRow = rows.find((row) => row.expenseId.toString() === editingId) ?? null;

  return (
    <div className="mnt-section-card">
      <div className="mnt-section-card__header">
        <div>
          <div className="mnt-eyebrow">Gestor operativo</div>
          <h2 className="mnt-title">Modificar gastos</h2>
          <p className="mnt-subtitle">
            Revisa y edita gastos de los edificios.
          </p>
        </div>
      </div>

      <div className="mnt-filters">
        <div className="mnt-field">
          <label className="mnt-label">Edificio</label>
          <select
            className="mnt-select"
            value={selectedBuildingId || ""}
            onChange={(event) => {
              const id = Number(event.target.value);
              setSelectedBuildingId(id || null);
              setEditingId(null);
            }}
          >
            {buildings.map((building) => (
              <option key={building.id} value={building.id}>
                {building.name} · {building.address}
              </option>
            ))}
          </select>
        </div>
        <div className="mnt-field mnt-field--grow">
          <label className="mnt-label">Buscar</label>
          <input
            className="mnt-input"
            placeholder="Descripción o concepto"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </div>

      <div className="mnt-table-wrap">
        <table className="mnt-table">
          <thead>
            <tr>
              <th>Descripción</th>
              <th>Tipo</th>
              <th>Monto</th>
              <th>Vencimiento</th>
              <th>Propiedades afectadas</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {isLoadingExpenses ? (
              <tr>
                <td colSpan={6} className="mnt-table__empty">
                  Cargando gastos comunes...
                </td>
              </tr>
            ) : filteredRows.length === 0 ? (
              <tr>
                <td colSpan={6} className="mnt-table__empty">
                  No hay gastos comunes para este edificio o búsqueda.
                </td>
              </tr>
            ) : (
              filteredRows.map((row) => (
                <tr key={row.expenseId}>
                  <td>{row.description}</td>
                  <td>{row.type}</td>
                  <td>{formatCurrency(row.totalAmount)}</td>
                  <td>{row.dueDate}</td>
                  <td>{row.affectedProperties}</td>
                  <td>
                    <button
                      type="button"
                      className="mnt-link-btn"
                      onClick={() => setEditingId(row.expenseId.toString())}
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {editingRow && (
        <div className="mnt-editor" ref={editorRef}>
          <div className="mnt-editor__header">
            <h3 className="mnt-editor__title">Editar gasto común</h3>
            <button
              type="button"
              className="mnt-link-btn"
              onClick={() => setEditingId(null)}
            >
              Cerrar
            </button>
          </div>
          <div className="mnt-editor__grid">
            <div className="mnt-field">
              <label className="mnt-label">Descripción</label>
              <input
                className="mnt-input"
                type="text"
                value={editingRow.description}
                disabled
              />
            </div>
            <div className="mnt-field">
              <label className="mnt-label">Monto Total</label>
              <input
                className="mnt-input"
                type="number"
                min="1"
                value={editingRow.totalAmount}
                disabled
              />
            </div>
            <div className="mnt-field">
              <label className="mnt-label">Tipo</label>
              <select className="mnt-select" value={editingRow.type} disabled>
                <option value="UTILITIES">Servicios</option>
                <option value="MAINTENANCE">Mantenimiento</option>
                <option value="REPAIR">Reparaciones</option>
                <option value="TAXES">Impuestos</option>
                <option value="ADMINISTRATION">Administración</option>
              </select>
            </div>
            <div className="mnt-field">
              <label className="mnt-label">Fecha de vencimiento</label>
              <input
                className="mnt-input"
                type="date"
                value={editingRow.dueDate}
                disabled
              />
            </div>
          </div>
          <div className="mnt-editor__actions">
            <button
              type="button"
              className="mnt-btn mnt-btn--secondary"
              onClick={() => setEditingId(null)}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="mnt-btn mnt-btn--primary"
              onClick={() => setEditingId(null)}
            >
              Guardar cambios
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
