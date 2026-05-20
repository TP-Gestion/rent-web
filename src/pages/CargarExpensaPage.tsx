import { useMemo, useState, useEffect } from 'react'
import { useBuildings } from '../hooks/useBuildings'
import { addExpensa, getExpensas } from '../hooks/useExpensas'
import type { ExpenseItem, ExpenseType } from '../types/expense'
import './CargarExpensaPage.css'


export default function CargarExpensaPage() {
  const { data: buildingsData, isLoading: loadingBuildings, error: buildingsError } = useBuildings()
  const [selectedBuildingId, setSelectedBuildingId] = useState<number>(0)
  const { data: expensasResponse, isLoading: loadingExpenses } = getExpensas(selectedBuildingId)
  const [type, setType] = useState<ExpenseType>('ORDINARIA')
  const [category, setCategory] = useState('SERVICIOS')
  const [concept, setConcept] = useState('')
  const [amount, setAmount] = useState<number | ''>('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const buildings = useMemo(() => {
    return buildingsData || []
  }, [buildingsData])

  const selectedBuildingName = useMemo(() => {
    return buildings.find((b) => b.id === selectedBuildingId)?.name || ''
  }, [buildings, selectedBuildingId])

  const existingExpenses = useMemo<ExpenseItem[]>(() => {
    const expenses = expensasResponse?.data
    return Array.isArray(expenses) ? expenses : []
  }, [expensasResponse])

  useEffect(() => {
    if (buildings.length > 0 && !selectedBuildingId) {
      setSelectedBuildingId(buildings[0].id)
    }
  }, [buildings, selectedBuildingId])

  const ordinaryExists = useMemo(() => {
    return existingExpenses.some((e) => e.type === 'ORDINARIA')
  }, [existingExpenses])

  const canSubmit = selectedBuildingId > 0 && amount !== '' && Number(amount) > 0 && concept.trim().length > 0 && (type === 'EXTRAORDINARIA' || (type === 'ORDINARIA' && !ordinaryExists))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    if (!canSubmit) return
    setSubmitting(true)
    try {
      const payload = {
        type,
        category: type === 'EXTRAORDINARIA' ? category : undefined,
        amount: Number(amount),
        concept,
      }
      await addExpensa(payload, selectedBuildingId)
      setMessage('Expensa cargada correctamente')
      // reset form for extraordinary only
      if (type === 'EXTRAORDINARIA') {
        setConcept('')
        setAmount('')
      }
    } catch (err) {
      setMessage('Error al cargar la expensa')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="exp-page">
      <div className="exp-page__hero">
        <div>
          <p className="exp-page__eyebrow">Administración operativa</p>
          <h1 className="exp-page__title">Cargar expensa</h1>
          <p className="exp-page__subtitle">
            Registrá expensas ordinarias o extraordinarias por edificio.
          </p>
        </div>
      </div>

      <div className="exp-page__layout">
        <form className="exp-card exp-form" onSubmit={handleSubmit}>
          {buildingsError && <div className="exp-alert exp-alert--error">No se pudieron cargar los edificios disponibles.</div>}

          <div className="exp-field">
            <label className="exp-label" htmlFor="building">Edificio</label>
            <select
              id="building"
              className="exp-select"
              value={selectedBuildingId || ''}
              onChange={(e) => setSelectedBuildingId(Number(e.target.value))}
              disabled={loadingBuildings}
            >
              <option value="">{loadingBuildings ? 'Cargando edificios...' : 'Seleccioná un edificio'}</option>
              {buildings.map((b) => (
                <option value={b.id} key={b.id}>{b.name}</option>
              ))}
            </select>
          </div>

          <div className="exp-field">
            <label className="exp-label">Tipo de expensa</label>
            <div className="exp-switch" role="tablist" aria-label="Tipo de expensa">
              <button
                type="button"
                className={`exp-switch__button${type === 'ORDINARIA' ? ' exp-switch__button--active' : ''}`}
                onClick={() => setType('ORDINARIA')}
                aria-pressed={type === 'ORDINARIA'}
              >
                Ordinaria
              </button>
              <button
                type="button"
                className={`exp-switch__button${type === 'EXTRAORDINARIA' ? ' exp-switch__button--active' : ''}`}
                onClick={() => setType('EXTRAORDINARIA')}
                aria-pressed={type === 'EXTRAORDINARIA'}
              >
                Extraordinaria
              </button>
            </div>
            <p className="exp-hint">
              La ordinaria se cobra una sola vez por edificio. La extraordinaria se cobra mensualmente de manera indefinida.
            </p>
          </div>

          {type === 'EXTRAORDINARIA' && (
            <div className="exp-field">
              <label className="exp-label" htmlFor="category">Categoría</label>
              <select
                id="category"
                className="exp-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="SERVICIOS">Servicios</option>
                <option value="LIMPIEZA">Limpieza</option>
                <option value="MANTENIMIENTO">Mantenimiento</option>
                <option value="OTROS">Otros</option>
              </select>
            </div>
          )}

          {type === 'ORDINARIA' && ordinaryExists && (
            <div className="exp-alert exp-alert--error">
              Ya existe una expensa ordinaria para este edificio. No se pueden crear más.
            </div>
          )}

          <div className="exp-field">
            <label className="exp-label" htmlFor="concept">Concepto</label>
            <input
              id="concept"
              className="exp-input"
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              placeholder="Ej: Limpieza mensual"
            />
          </div>

          <div className="exp-field">
            <label className="exp-label" htmlFor="amount">Monto</label>
            <input
              id="amount"
              className="exp-input"
              type="number"
              min={0}
              value={amount}
              onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="0"
            />
          </div>

          <button className="exp-primary" type="submit" disabled={!canSubmit || submitting}>
            {submitting ? 'Cargando...' : 'Cargar expensa'}
          </button>

          {message && (
            <div className={`exp-alert ${message.startsWith('Error') ? 'exp-alert--error' : 'exp-alert--success'}`}>
              {message}
            </div>
          )}
        </form>

        <aside className="exp-card exp-summary">
          <h2 className="exp-card__title">Expensas del edificio</h2>
          <p className="exp-card__subtitle">
            {selectedBuildingName || 'Seleccioná un edificio para ver sus expensas'}
          </p>

          {loadingExpenses && <div className="exp-empty">Cargando expensas...</div>}

          <div className="exp-list">
            {!loadingExpenses && existingExpenses.length === 0 ? (
              <div className="exp-empty">No hay expensas cargadas para este edificio.</div>
            ) : (
              existingExpenses.map((e) => (
                <article className="exp-item" key={e.id}>
                  <div className="exp-item__top">
                    <strong>{e.type === 'ORDINARIA' ? 'Ordinaria' : 'Extraordinaria'}</strong>
                    <span className={`exp-item__pill exp-item__pill--${e.type === 'ORDINARIA' ? 'one' : 'many'}`}>
                      {e.frequency}
                    </span>
                  </div>
                  <div className="exp-item__concept">{e.concept}</div>
                  <div className="exp-item__meta">
                    <span>${e.amount}</span>
                    {e.category && <span>{e.category}</span>}
                  </div>
                </article>
              ))
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
