import { useMemo, useState } from "react"
import type { PropiedadListItem } from "../../service/propiedades"
import { formatCurrency } from "../../utils/propertyDetail"

interface ExpenseRow {
  id: string
  propertyId: string
  building: string
  floor: string
  concept: string
  category: string
  amount: number
  frequency: "UNICA" | "MENSUAL"
  duration: string
  status: "ACTIVO" | "PAUSADO"
}

interface ExpenseMaintenanceSectionProps {
  properties: PropiedadListItem[]
}

function getInitialRows(properties: PropiedadListItem[]): ExpenseRow[] {
  return properties.slice(0, 24).map((property) => ({
    id: `g-${property.id}`,
    propertyId: String(property.id),
    building: property.edificio,
    floor: property.piso,
    concept: `Gasto operativo ${property.edificio}`,
    category: "SERVICIOS",
    amount: Math.max(1, Math.round(property.expensas * 0.35)),
    frequency: property.estadoOcupacion === "OCUPADO" ? "MENSUAL" : "UNICA",
    duration: property.estadoOcupacion === "OCUPADO" ? "INDEFINIDA" : "1 MES",
    status: "ACTIVO",
  }))
}

export default function ExpenseMaintenanceSection({ properties }: ExpenseMaintenanceSectionProps) {
  const [rows, setRows] = useState<ExpenseRow[]>(() => getInitialRows(properties))
  const [buildingFilter, setBuildingFilter] = useState("TODOS")
  const [search, setSearch] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)

  const buildingOptions = useMemo(() => {
    const uniqueBuildings = Array.from(new Set(rows.map((row) => row.building)))
    return ["TODOS", ...uniqueBuildings]
  }, [rows])

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const matchesBuilding = buildingFilter === "TODOS" || row.building === buildingFilter
      const matchesSearch =
        search.trim() === "" ||
        row.concept.toLowerCase().includes(search.toLowerCase()) ||
        `${row.building} ${row.floor}`.toLowerCase().includes(search.toLowerCase())
      return matchesBuilding && matchesSearch
    })
  }, [rows, buildingFilter, search])

  const editingRow = rows.find((row) => row.id === editingId) ?? null

  const updateRow = (id: string, updates: Partial<ExpenseRow>) => {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, ...updates } : row)))
  }

  return (
    <div className="mnt-section-card">
      <div className="mnt-section-card__header">
        <div>
          <div className="mnt-eyebrow">Gestor operativo</div>
          <h2 className="mnt-title">Modificar gastos</h2>
          <p className="mnt-subtitle">
            Revisa y edita gastos de los edificios. Esta vista es la base para conectar luego con la API de gastos.
          </p>
        </div>
      </div>

      <div className="mnt-filters">
        <div className="mnt-field">
          <label className="mnt-label">Edificio</label>
          <select
            className="mnt-select"
            value={buildingFilter}
            onChange={(event) => setBuildingFilter(event.target.value)}
          >
            {buildingOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="mnt-field mnt-field--grow">
          <label className="mnt-label">Buscar</label>
          <input
            className="mnt-input"
            placeholder="Concepto o unidad"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </div>

      <div className="mnt-table-wrap">
        <table className="mnt-table">
          <thead>
            <tr>
              <th>Unidad</th>
              <th>Concepto</th>
              <th>Categoria</th>
              <th>Monto</th>
              <th>Frecuencia</th>
              <th>Estado</th>
              <th>Accion</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.length === 0 ? (
              <tr>
                <td colSpan={7} className="mnt-table__empty">
                  No hay gastos para los filtros seleccionados.
                </td>
              </tr>
            ) : (
              filteredRows.map((row) => (
                <tr key={row.id}>
                  <td>{row.building} · Piso {row.floor}</td>
                  <td>{row.concept}</td>
                  <td>{row.category}</td>
                  <td>{formatCurrency(row.amount)}</td>
                  <td>{row.frequency === "MENSUAL" ? `Mensual · ${row.duration}` : "Unica vez"}</td>
                  <td>
                    <span className={`mnt-badge${row.status === "ACTIVO" ? " mnt-badge--ok" : " mnt-badge--paused"}`}>
                      {row.status}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="mnt-link-btn"
                      onClick={() => setEditingId(row.id)}
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
        <div className="mnt-editor">
          <div className="mnt-editor__header">
            <h3 className="mnt-editor__title">Editar gasto</h3>
            <button type="button" className="mnt-link-btn" onClick={() => setEditingId(null)}>
              Cerrar
            </button>
          </div>
          <div className="mnt-editor__grid">
            <div className="mnt-field">
              <label className="mnt-label">Concepto</label>
              <input
                className="mnt-input"
                value={editingRow.concept}
                onChange={(event) => updateRow(editingRow.id, { concept: event.target.value })}
              />
            </div>
            <div className="mnt-field">
              <label className="mnt-label">Monto</label>
              <input
                className="mnt-input"
                type="number"
                min="1"
                value={editingRow.amount}
                onChange={(event) =>
                  updateRow(editingRow.id, { amount: Math.max(1, Number(event.target.value || 0)) })
                }
              />
            </div>
            <div className="mnt-field">
              <label className="mnt-label">Frecuencia</label>
              <select
                className="mnt-select"
                value={editingRow.frequency}
                onChange={(event) =>
                  updateRow(editingRow.id, {
                    frequency: event.target.value as ExpenseRow["frequency"],
                    duration: event.target.value === "MENSUAL" ? editingRow.duration : "1 MES",
                  })
                }
              >
                <option value="UNICA">Unica vez</option>
                <option value="MENSUAL">Mensual</option>
              </select>
            </div>
            <div className="mnt-field">
              <label className="mnt-label">Duracion</label>
              <input
                className="mnt-input"
                value={editingRow.duration}
                disabled={editingRow.frequency === "UNICA"}
                onChange={(event) => updateRow(editingRow.id, { duration: event.target.value })}
              />
            </div>
          </div>
          <div className="mnt-editor__actions">
            <button type="button" className="mnt-btn mnt-btn--secondary" onClick={() => setEditingId(null)}>
              Cancelar
            </button>
            <button type="button" className="mnt-btn mnt-btn--primary" onClick={() => setEditingId(null)}>
              Guardar cambios
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
