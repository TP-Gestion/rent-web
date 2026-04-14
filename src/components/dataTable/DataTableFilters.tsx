import type { Tab, BuildingOption } from './dataTable.constants'
import { TABS } from './dataTable.constants'

interface TabFilterProps {
  activeTab: string
  onChange: (tab: string) => void
}

function TabFilter({ activeTab, onChange }: TabFilterProps) {
  return (
    <div className="tab-filter" role="tablist" aria-label="Filtrar por estado">
      {TABS.map((tab: Tab) => {
        const isActive = activeTab === tab.key

        return (
          <button
            key={tab.key}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.key)}
            className={`tab-filter__button${isActive ? ' tab-filter__button--active' : ''}`}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}

interface BuildingFilterProps {
  value: string
  options: BuildingOption[]
  onChange: (value: string) => void
}

function BuildingFilter({ value, options, onChange }: BuildingFilterProps) {
  return (
    <div className="building-filter">
      <span className="building-filter__label">FILTRAR POR EDIFICIO</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label="Filtrar por edificio"
        className="building-filter__select"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

interface DataTableFiltersProps {
  activeTab: string
  building: string
  buildingOptions: BuildingOption[]
  onTabChange: (tab: string) => void
  onBuildingChange: (building: string) => void
}

export default function DataTableFilters({ activeTab, building, buildingOptions, onTabChange, onBuildingChange }: DataTableFiltersProps) {
  return (
    <div className="data-table__controls">
      <TabFilter activeTab={activeTab} onChange={onTabChange} />
      <BuildingFilter value={building} options={buildingOptions} onChange={onBuildingChange} />
    </div>
  )
}
