import { usePropiedades } from "../hooks/usePropiedades"
import {
  ExpenseMaintenanceSection,
} from "../components/maintenance"
import "./MaintenancePage.css"

export default function MaintenancePage() {
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
      {isLoading && (
        <div className="mnt-loading">Cargando datos de propiedades...</div>
      )}

      {isError && (
        <div className="mnt-error">No se pudo cargar la informacion necesaria.</div>
      )}

      {!isLoading && !isError  && (
        <ExpenseMaintenanceSection properties={properties} />
      )}

    </div>
  )
}
