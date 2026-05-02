interface MaintenanceTabsProps {
  activeTab: "expenses" | "liquidation"
  onChange: (tab: "expenses" | "liquidation") => void
}

const TABS: { key: "expenses" | "liquidation"; label: string }[] = [
  { key: "expenses", label: "Modificar gastos" },
  { key: "liquidation", label: "Fecha de liquidacion" },
]

export default function MaintenanceTabs({ activeTab, onChange }: MaintenanceTabsProps) {
  return (
    <div className="mnt-tabs">
      {TABS.map((tab) => {
        const isActive = tab.key === activeTab

        return (
          <button
            key={tab.key}
            type="button"
            className={`mnt-tabs__item${isActive ? " mnt-tabs__item--active" : ""}`}
            onClick={() => onChange(tab.key)}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
