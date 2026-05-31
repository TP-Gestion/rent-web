import { useEffect, useMemo, useState } from "react"
import { useBuildings } from "../hooks/useBuildings"
import { getExpensas } from "../hooks/useExpensas"
import { useUpdateExpense } from "../hooks/useMaintenance"
import type { ExpenseItem, ExpenseType } from "../types/expense"
import { formatCurrency } from "../utils/propertyDetail"
import "./MaintenancePage.css"

type ExpenseDraft = {
  type: ExpenseType
  category: string
  concept: string
  amount: string
}

const EMPTY_DRAFT: ExpenseDraft = {
  type: "ORDINARIA",
  category: "SERVICIOS",
  concept: "",
  amount: "",
}

function expenseToDraft(expense: ExpenseItem): ExpenseDraft {
  return {
    type: expense.type,
    category: expense.category ?? "SERVICIOS",
    concept: expense.concept ?? "",
    amount: String(expense.amount),
  }
}

export default function MaintenancePage() {
  const { data: buildingsData, isLoading: loadingBuildings, error: buildingsError } = useBuildings()
  const [selectedBuildingId, setSelectedBuildingId] = useState<number>(0)
  const [selectedExpenseId, setSelectedExpenseId] = useState<number | null>(null)
  const [draft, setDraft] = useState<ExpenseDraft>(EMPTY_DRAFT)
  const [feedback, setFeedback] = useState<string | null>(null)

  const buildings = useMemo(() => buildingsData ?? [], [buildingsData])

  useEffect(() => {
    if (buildings.length > 0 && !selectedBuildingId) {
      setSelectedBuildingId(buildings[0].id)
    }
  }, [buildings, selectedBuildingId])

  const { data: expensesResponse, isLoading: loadingExpenses, error: expensesError } = getExpensas(selectedBuildingId)

  const expenses = useMemo(() => {
    const items = expensesResponse?.data
    return Array.isArray(items) ? items : []
  }, [expensesResponse])

  const selectedBuilding = useMemo(
    () => buildings.find((building) => building.id === selectedBuildingId) ?? null,
    [buildings, selectedBuildingId],
  )

  const selectedExpense = useMemo(
    () => expenses.find((expense) => expense.id === selectedExpenseId) ?? null,
    [expenses, selectedExpenseId],
  )

  useEffect(() => {
    if (selectedExpense) {
      setDraft(expenseToDraft(selectedExpense))
      setFeedback(null)
      return
    }

    setDraft(EMPTY_DRAFT)
  }, [selectedExpense])

  useEffect(() => {
    setSelectedExpenseId(null)
    setFeedback(null)
  }, [selectedBuildingId])

  const updateExpenseMutation = useUpdateExpense(selectedBuildingId)

  const canSave = Boolean(
    selectedExpense &&
      draft.concept.trim().length > 0 &&
      draft.amount.trim().length > 0 &&
      Number(draft.amount) > 0,
  )

  const handleSave = () => {
    if (!selectedExpense || !canSave) return

    updateExpenseMutation.mutate({
      expenseId: selectedExpense.id,
      body: {
        type: draft.type,
        category: draft.type === "EXTRAORDINARIA" ? draft.category : undefined,
        concept: draft.concept.trim(),
        amount: Number(draft.amount),
      },
    })
  }

  return (
    <div className="mnt-page">
      <div className="mnt-page__header">
        <div className="mnt-page__section-label">Mantenimiento</div>
        <h1 className="mnt-page__title">Modificar gastos de edificio</h1>
        <p className="mnt-page__subtitle">
          Elegí un edificio y editá sus gastos ordinarios o extraordinarios.
        </p>
      </div>

      {loadingBuildings && <div className="mnt-loading">Cargando edificios...</div>}
      {buildingsError && <div className="mnt-error">No se pudieron cargar los edificios.</div>}

      {!loadingBuildings && !buildingsError && (
        <div className="mnt-shell">
          <section className="mnt-panel">
            <div className="mnt-panel__header">
              <div>
                <div className="mnt-eyebrow">Edificio</div>
                <h2 className="mnt-title">Seleccionar edificio</h2>
              </div>
            </div>

            <div className="mnt-field">
              <label className="mnt-label" htmlFor="building">Edificio</label>
              <select
                id="building"
                className="mnt-select"
                value={selectedBuildingId || ""}
                onChange={(event) => setSelectedBuildingId(Number(event.target.value))}
              >
                <option value="">Seleccioná un edificio</option>
                {buildings.map((building) => (
                  <option key={building.id} value={building.id}>
                    {building.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedBuilding && (
              <div className="mnt-summary">
                <div className="mnt-summary__label">Edificio activo</div>
                <div className="mnt-summary__value">{selectedBuilding.name}</div>
                <div className="mnt-summary__note">{selectedBuilding.address}</div>
              </div>
            )}
          </section>

          <section className="mnt-panel mnt-panel--wide">
            <div className="mnt-panel__header">
              <div>
                <div className="mnt-eyebrow">Gastos</div>
                <h2 className="mnt-title">Gastos del edificio</h2>
                <p className="mnt-subtitle">
                  Seleccioná un gasto para editarlo.
                </p>
              </div>
            </div>

            {feedback && <div className="mnt-feedback">{feedback}</div>}
            {expensesError && <div className="mnt-error">No se pudieron cargar los gastos.</div>}
            {loadingExpenses && <div className="mnt-loading">Cargando gastos...</div>}

            {!loadingExpenses && !expensesError && (
              <div className="mnt-list">
                {expenses.length === 0 ? (
                  <div className="mnt-empty">Este edificio todavía no tiene gastos cargados.</div>
                ) : (
                  expenses.map((expense) => (
                    <article
                      key={expense.id}
                      className={`mnt-item${selectedExpenseId === expense.id ? " mnt-item--active" : ""}`}
                    >
                      <button
                        type="button"
                        className="mnt-item__button"
                        onClick={() => setSelectedExpenseId(expense.id)}
                      >
                        <div className="mnt-item__top">
                          <strong>{expense.concept || "Sin concepto"}</strong>
                          <span className={`mnt-pill mnt-pill--${expense.type === "ORDINARIA" ? "one" : "many"}`}>
                            {expense.type}
                          </span>
                        </div>
                        <div className="mnt-item__meta">
                          <span>{expense.category ?? "Sin categoría"}</span>
                          <span>{formatCurrency(expense.amount)}</span>
                          <span>{expense.frequency}</span>
                        </div>
                      </button>
                    </article>
                  ))
                )}
              </div>
            )}
          </section>

          <section className="mnt-panel mnt-panel--editor">
            <div className="mnt-panel__header">
              <div>
                <div className="mnt-eyebrow">Edición</div>
                <h2 className="mnt-title">Modificar gasto</h2>
              </div>
            </div>

            {!selectedExpense ? (
              <div className="mnt-empty">Seleccioná un gasto para editar sus datos.</div>
            ) : (
              <div className="mnt-editor">
                <div className="mnt-field">
                  <label className="mnt-label">Tipo</label>
                  <select
                    className="mnt-select"
                    value={draft.type}
                    onChange={(event) =>
                      setDraft((prev) => ({
                        ...prev,
                        type: event.target.value as ExpenseType,
                      }))
                    }
                  >
                    <option value="ORDINARIA">Ordinaria</option>
                    <option value="EXTRAORDINARIA">Extraordinaria</option>
                  </select>
                </div>

                <div className="mnt-field">
                  <label className="mnt-label">Categoría</label>
                  <select
                    className="mnt-select"
                    value={draft.category}
                    onChange={(event) =>
                      setDraft((prev) => ({ ...prev, category: event.target.value }))
                    }
                    disabled={draft.type === "ORDINARIA"}
                  >
                    <option value="SERVICIOS">Servicios</option>
                    <option value="LIMPIEZA">Limpieza</option>
                    <option value="MANTENIMIENTO">Mantenimiento</option>
                    <option value="OTROS">Otros</option>
                  </select>
                </div>

                <div className="mnt-field mnt-field--full">
                  <label className="mnt-label">Concepto</label>
                  <input
                    className="mnt-input"
                    value={draft.concept}
                    onChange={(event) =>
                      setDraft((prev) => ({ ...prev, concept: event.target.value }))
                    }
                    placeholder="Ej: Limpieza de espacios comunes"
                  />
                </div>

                <div className="mnt-field">
                  <label className="mnt-label">Monto</label>
                  <input
                    className="mnt-input"
                    type="number"
                    min="1"
                    value={draft.amount}
                    onChange={(event) =>
                      setDraft((prev) => ({ ...prev, amount: event.target.value }))
                    }
                  />
                </div>

                <div className="mnt-editor__actions">
                  <button
                    type="button"
                    className="mnt-btn mnt-btn--secondary"
                    onClick={() => {
                      setSelectedExpenseId(null)
                      setDraft(EMPTY_DRAFT)
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="mnt-btn mnt-btn--primary"
                    onClick={handleSave}
                    disabled={!canSave || updateExpenseMutation.isPending}
                  >
                    {updateExpenseMutation.isPending ? "Guardando..." : "Guardar cambios"}
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  )
}