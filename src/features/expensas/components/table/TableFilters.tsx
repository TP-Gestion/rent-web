import { BUILDING_OPTIONS, TABS } from "../../mocks/expensasDashboard";
import styles from "../ExpensasDataTable.module.css";

interface TabFilterProps {
  activeTab: string;
  onChange: (tab: string) => void;
}

interface BuildingFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export function TabFilter({ activeTab, onChange }: TabFilterProps) {
  return (
    <div className={styles.tabs} role="tablist" aria-label="Filtrar por estado">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key;

        return (
          <button
            key={tab.key}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.key)}
            className={`${styles.tabButton} ${isActive ? styles.tabButtonActive : ""}`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

export function BuildingFilter({ value, onChange }: BuildingFilterProps) {
  return (
    <div className={styles.buildingFilter}>
      <span className={styles.buildingLabel}>FILTRAR POR EDIFICIO</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label="Filtrar por edificio"
        className={styles.buildingSelect}
      >
        {BUILDING_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
