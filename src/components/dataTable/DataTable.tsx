import { useState } from 'react'
import type { Tenant } from '../../propiedadService'
import {
  BUILDING_OPTIONS,
  COL_HEADERS,
} from './dataTable.constants'
import DataTableBody from './DataTableBody'
import DataTableFilters from './DataTableFilters'
import DataTablePagination from './DataTablePagination'
import './DataTable.css'

interface FilterState {
  tab: string
  building: string
  page: number
}

interface DataTableProps {
  tenants: Tenant[]
  totalResults: number
  perPage: number
  onVerDetalle?: (tenant: Tenant) => void
  onFilterChange?: (filters: FilterState) => void
}

export default function DataTable({
  tenants,
  totalResults,
  perPage,
  onVerDetalle,
  onFilterChange,
}: DataTableProps) {
  const [activeTab, setActiveTab] = useState('todos')
  const [building, setBuilding] = useState('torres-este')
  const [page, setPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(totalResults / perPage))

  const notifyChange = (updates: Partial<FilterState>) => {
    const state: FilterState = { tab: activeTab, building, page, ...updates }
    if (onFilterChange) onFilterChange(state)
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setPage(1)
    notifyChange({ tab, page: 1 })
  }

  const handleBuildingChange = (b: string) => {
    setBuilding(b)
    setPage(1)
    notifyChange({ building: b, page: 1 })
  }

  const handlePageChange = (p: number) => {
    setPage(p)
    notifyChange({ page: p })
  }

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
  )
}
