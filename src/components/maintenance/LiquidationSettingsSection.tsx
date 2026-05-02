import { useMemo, useState } from "react"
import type { PropiedadListItem } from "../../service/propiedades"

interface LiquidationSettingsSectionProps {
  properties: PropiedadListItem[]
}

function getNextLiquidationDate(dayOfMonth: number): string {
  const now = new Date()
  const candidate = new Date(now.getFullYear(), now.getMonth(), dayOfMonth)
  if (candidate < now) {
    candidate.setMonth(candidate.getMonth() + 1)
  }

  return candidate.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export default function LiquidationSettingsSection({ properties }: LiquidationSettingsSectionProps) {
  const buildingOptions = useMemo(
    () => ["TODOS", ...Array.from(new Set(properties.map((property) => property.edificio)))],
    [properties],
  )

  const [building, setBuilding] = useState("TODOS")
  const [liquidationDay, setLiquidationDay] = useState(10)
  const [graceDays, setGraceDays] = useState(2)
  const [savedMessage, setSavedMessage] = useState("")

  const nextDateLabel = getNextLiquidationDate(liquidationDay)

  const handleSave = () => {
    const scopeLabel = building === "TODOS" ? "todos los edificios" : building
    setSavedMessage(`Configuracion guardada para ${scopeLabel}. Proxima liquidacion: ${nextDateLabel}.`)
  }

  return (
    <div className="mnt-section-card">
      <div className="mnt-section-card__header">
        <div>
          <div className="mnt-eyebrow">Configuracion contable</div>
          <h2 className="mnt-title">Fecha de liquidacion</h2>
          <p className="mnt-subtitle">
            Cambia el dia de liquidacion mensual y define los dias de gracia. Es una configuracion simple para mantenimiento operativo.
          </p>
        </div>
      </div>

      <div className="mnt-settings-grid">
        <div className="mnt-field">
          <label className="mnt-label">Alcance</label>
          <select
            className="mnt-select"
            value={building}
            onChange={(event) => setBuilding(event.target.value)}
          >
            {buildingOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="mnt-field">
          <label className="mnt-label">Dia de liquidacion</label>
          <input
            className="mnt-input"
            type="number"
            min="1"
            max="28"
            value={liquidationDay}
            onChange={(event) => setLiquidationDay(Math.min(28, Math.max(1, Number(event.target.value || 1))))}
          />
        </div>

        <div className="mnt-field">
          <label className="mnt-label">Dias de gracia</label>
          <input
            className="mnt-input"
            type="number"
            min="0"
            max="15"
            value={graceDays}
            onChange={(event) => setGraceDays(Math.min(15, Math.max(0, Number(event.target.value || 0))))}
          />
        </div>
      </div>

      <div className="mnt-callout">
        <div className="mnt-callout__label">Proxima liquidacion estimada</div>
        <div className="mnt-callout__value">{nextDateLabel}</div>
        <div className="mnt-callout__note">Vencimiento sugerido: {graceDays} dias despues.</div>
      </div>

      <div className="mnt-actions">
        <button type="button" className="mnt-btn mnt-btn--primary" onClick={handleSave}>
          Guardar configuracion
        </button>
      </div>

      {savedMessage && <div className="mnt-feedback">{savedMessage}</div>}
    </div>
  )
}
