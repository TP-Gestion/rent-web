import { useEffect, useMemo, useState } from 'react'
import { getPropiedades } from '../service/propiedades'
import type { PropiedadListItem } from '../service/propiedades'
import { createExpense, getExpensesForBuilding, type ExpenseType } from '../service/expense'
import './CargarExpensaPage.css'

export default function CargarExpensaPage() {
  const [buildings, setBuildings] = useState<string[]>([])
  const [loadingBuildings, setLoadingBuildings] = useState(false)
  const [selectedBuilding, setSelectedBuilding] = useState('')
  const [type, setType] = useState<ExpenseType>('ORDINARIA')
  const [category, setCategory] = useState('SERVICIOS')
  const [concept, setConcept] = useState('')
  const [amount, setAmount] = useState<number | ''>('')
  const [existingExpenses, setExistingExpenses] = useState<any[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    setLoadingBuildings(true)
    getPropiedades()
      .then((list) => {
        const unique = Array.from(new Set(list.map((p: PropiedadListItem) => p.edificio)))
        setBuildings(unique)
        if (unique.length > 0) setSelectedBuilding(unique[0])
      })
      .finally(() => setLoadingBuildings(false))
  }, [])

  useEffect(() => {
    if (!selectedBuilding) return
    getExpensesForBuilding(selectedBuilding)
      .then((res: any) => setExistingExpenses(res.data || []))
      .catch(() => setExistingExpenses([]))
  }, [selectedBuilding])

  const ordinaryExists = useMemo(() => {
    return existingExpenses.some((e) => e.type === 'ORDINARIA')
  }, [existingExpenses])

  const canSubmit = selectedBuilding && amount !== '' && Number(amount) > 0 && concept.trim().length > 0 && (type === 'EXTRAORDINARIA' || (type === 'ORDINARIA' && !ordinaryExists))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    if (!canSubmit) return
    setSubmitting(true)
    try {
      const payload = {
        building: selectedBuilding,
        type,
        category: type === 'EXTRAORDINARIA' ? category : undefined,
        amount: Number(amount),
        concept,
      }
      await createExpense(payload)
      setMessage('Expensa cargada correctamente')
      // refresh existing expenses
      const res = await getExpensesForBuilding(selectedBuilding)
      setExistingExpenses(res.data || [])
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
    <div className="cargar-expensa-page">
      <section className="cargar-expensa-card">
        <h2 className="cargar-expensa__title">Cargar expensa</h2>
        <form onSubmit={handleSubmit} className="cargar-expensa-form">
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', marginBottom: 6 }}>Edificio</label>
          <select value={selectedBuilding} onChange={(e) => setSelectedBuilding(e.target.value)} disabled={loadingBuildings}>
            {buildings.map((b) => (
              <option value={b} key={b}>{b}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', marginBottom: 6 }}>Tipo de expensa</label>
          <div>
            <label style={{ marginRight: 12 }}>
              <input type="radio" checked={type === 'ORDINARIA'} onChange={() => setType('ORDINARIA')} /> Ordinaria
            </label>
            <label>
              <input type="radio" checked={type === 'EXTRAORDINARIA'} onChange={() => setType('EXTRAORDINARIA')} /> Extraordinaria
            </label>
          </div>
        </div>

        {type === 'EXTRAORDINARIA' && (
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 6 }}>Categoría</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="SERVICIOS">SERVICIOS</option>
              <option value="MANTENIMIENTO">MANTENIMIENTO</option>
              <option value="OTROS">OTROS</option>
            </select>
            <div style={{ fontSize: 12, color: '#6b7280', marginTop: 6 }}>Las expensas extraordinarias se cobrarán mensualmente de manera indefinida.</div>
          </div>
        )}

        {type === 'ORDINARIA' && ordinaryExists && (
          <div style={{ color: '#b91c1c', marginBottom: 12 }}>Ya existe una expensa ordinaria para este edificio. No se pueden crear más.</div>
        )}

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', marginBottom: 6 }}>Concepto</label>
          <input value={concept} onChange={(e) => setConcept(e.target.value)} />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', marginBottom: 6 }}>Monto</label>
          <input type="number" min={0} value={amount} onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))} />
        </div>

        <div style={{ marginTop: 18 }}>
          <button type="submit" disabled={!canSubmit || submitting}>{submitting ? 'Cargando...' : 'Cargar expensa'}</button>
        </div>

        {message && <div style={{ marginTop: 12 }}>{message}</div>}
        </form>

        <section className="cargar-expensa__existing" aria-label="expensas-actuales">
          <h3>Expensas actuales del edificio</h3>
          <ul>
            {existingExpenses.map((e) => (
              <li key={e.id} className="cargar-expensa__existing-item">{e.type} · {e.concept} · {e.amount} · {e.frequency}</li>
            ))}
          </ul>
        </section>
      </section>
    </div>
  )
}
