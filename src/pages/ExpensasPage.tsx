import { useState, useEffect } from 'react'
import StatCard from '../components/StatCard'
import DataTable from '../components/dataTable/DataTable'
import { MorosityCard, BatchActionsCard } from '../components/bottomCards'
import type { Tenant, TenantStatus } from '../propiedadService'
import {
  EXPENSAS_PERIOD_LABEL,
  PER_PAGE,
  getAllTenants,
  getBatchActionsData,
  getExpensasStats,
  getMorosityData,
} from '../propiedadService'
import './ExpensasPage.css'

interface FilterState {
  tab: string
  building: string
  page: number
}

interface HeaderButtonProps {
  label: string
  primary?: boolean
  onClick?: () => void
}

function HeaderButton({ label, primary, onClick }: HeaderButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`expensas-header-button${primary ? ' expensas-header-button--primary' : ''}`}
    >
      {label}
    </button>
  )
}

export default function ExpensasPage() {
  const allTenants = getAllTenants()
  const stats = getExpensasStats()
  const morosityData = getMorosityData()
  const batchActionsData = getBatchActionsData()

  const [filters, setFilters] = useState<FilterState>({ tab: 'todos', building: 'todos', page: 1 })
  const [visibleTenants, setVisibleTenants] = useState<Tenant[]>([])
  const [totalResults, setTotalResults] = useState(0)

  useEffect(() => {
    let filtered = [...allTenants]

    if (filters.tab !== 'todos') {
      const statusMap: Record<string, TenantStatus> = { pagados: 'pagado', pendientes: 'pendiente', vencidos: 'vencido' }
      const mapped = statusMap[filters.tab]
      if (mapped) filtered = filtered.filter((t) => t.status === mapped)
    }

    if (filters.building !== 'todos') {
      const buildingMap: Record<string, string | null> = {
        'solaris-i': 'Torre Solaris I',
        'solaris-ii': 'Torre Solaris II',
        'torres-este': null,
      }
      const buildingStr = buildingMap[filters.building]
      if (buildingStr) {
        filtered = filtered.filter((t) => t.property.startsWith(buildingStr))
      }
    }

    setTotalResults(filtered.length)

    const start = (filters.page - 1) * PER_PAGE
    setVisibleTenants(filtered.slice(start, start + PER_PAGE))
  }, [filters, allTenants])

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters)
  }

  const handleVerDetalle = (tenant: Tenant) => {
    alert(`Ver detalle de: ${tenant.name}\nPropiedad: ${tenant.property}\nMonto: $${tenant.amount.toLocaleString('es-AR')}`)
  }

  const handleExportar = () => {
    alert('Exportando reporte de Marzo 2026...')
  }

  const handleGenerarLiquidacion = () => {
    alert('Generando liquidación...')
  }

  return (
    <div className="expensas-page">
      {/* ── Page Header ── */}
      <div className="expensas-page__header">
        <div>
          <div className="expensas-page__section-label">
            Administración de Cartera
          </div>
          <h1 className="expensas-page__title">
            Expensas de Inquilinos
          </h1>
          <div className="expensas-page__period">
            PERIODO: {EXPENSAS_PERIOD_LABEL}
          </div>
        </div>
        <div className="expensas-page__header-actions">
          <HeaderButton label="↓  Exportar reporte" onClick={handleExportar} />
          <HeaderButton label="+ Generar liquidación" primary onClick={handleGenerarLiquidacion} />
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="expensas-page__stats-grid">
        {stats.map((s) => (
          <StatCard
            key={s.label}
            label={s.label}
            value={s.value}
            badge={s.badge}
            variant={s.variant}
          />
        ))}
      </div>

      {/* ── Data Table ── */}
      <DataTable
        tenants={visibleTenants}
        totalResults={totalResults}
        perPage={PER_PAGE}
        onVerDetalle={handleVerDetalle}
        onFilterChange={handleFilterChange}
      />

      {/* ── Bottom Cards ── */}
      <div className="expensas-page__bottom-grid">
        <MorosityCard
          percentage={morosityData.percentage}
          trend={morosityData.trend}
          trendLabel={morosityData.trendLabel}
          description={morosityData.description}
          onVerInforme={() => alert('Abriendo informe de morosidad...')}
          onConfigurar={() => alert('Abriendo configuración de alertas...')}
        />
        <BatchActionsCard
          pendingCount={batchActionsData.pendingCount}
          lastSyncLabel={batchActionsData.lastSyncLabel}
          onSendReminders={() => alert('Enviando recordatorios a 14 inquilinos...')}
          onReconcileBank={() => alert('Iniciando conciliación bancaria...')}
        />
      </div>
    </div>
  )
}

