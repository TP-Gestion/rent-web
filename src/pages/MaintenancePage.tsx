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
        <h1 className="mnt-page__title">Mantenimiento financiero</h1>
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
