import { useState } from "react"
import { usePropiedades } from "../hooks/usePropiedades"
import {
  ExpenseMaintenanceSection,
  LiquidationSettingsSection,
  MaintenanceTabs,
} from "../components/maintenance"
import "./MaintenancePage.css"

export default function MaintenancePage() {
  const [activeTab, setActiveTab] = useState<"expenses" | "liquidation">("expenses")
  const { data: properties = [], isLoading, isError } = usePropiedades()

  return (
    <div className="mnt-page">
      <div className="mnt-page__header">
        <div className="mnt-page__section-label">Centro de mantenimiento</div>
        <h1 className="mnt-page__title">Mantenimiento financiero</h1>
        <p className="mnt-page__subtitle">
          Gestiona ajustes operativos: edicion de gastos cargados y configuracion de fecha de liquidacion.
        </p>
      </div>

      <MaintenanceTabs activeTab={activeTab} onChange={setActiveTab} />

      {isLoading && (
        <div className="mnt-loading">Cargando datos de propiedades...</div>
      )}

      {isError && (
        <div className="mnt-error">No se pudo cargar la informacion necesaria.</div>
      )}

      {!isLoading && !isError && activeTab === "expenses" && (
        <ExpenseMaintenanceSection properties={properties} />
      )}

      {!isLoading && !isError && activeTab === "liquidation" && (
        <LiquidationSettingsSection properties={properties} />
      )}
    </div>
  )
}
