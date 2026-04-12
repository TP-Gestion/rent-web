import { TABS } from "./dataTable.constants";

function TabFilter({ activeTab, onChange }) {
  return (
    <div className="tab-filter" role="tablist" aria-label="Filtrar por estado">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key;

        return (
          <button
            key={tab.key}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.key)}
            className={`tab-filter__button${isActive ? " tab-filter__button--active" : ""}`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

function BuildingFilter({ value, options, onChange }) {
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
  );
}

export default function DataTableFilters({ activeTab, building, buildingOptions, onTabChange, onBuildingChange }) {
  return (
    <div className="data-table__controls">
      <TabFilter activeTab={activeTab} onChange={onTabChange} />
      <BuildingFilter value={building} options={buildingOptions} onChange={onBuildingChange} />
    </div>
  );
}