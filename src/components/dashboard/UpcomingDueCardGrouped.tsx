import type { UpcomingDueItem } from "./types";
import "./UpcomingDueCardGrouped.css";

interface UpcomingDueCardGroupedProps {
  items: UpcomingDueItem[];
  onSeeAll: () => void;
  onOpenProperty: (propertyId: number) => void;
  getDueLabel: (daysToDue: number | null) => string;
}

export default function UpcomingDueCardGrouped({
  items,
  onSeeAll,
  onOpenProperty,
  getDueLabel,
}: UpcomingDueCardGroupedProps) {
  const overdue = items.filter((i) => i.daysToDue != null && i.daysToDue < 0);
  const upcoming = items.filter((i) => i.daysToDue != null && i.daysToDue >= 0);

  const hasItems = overdue.length > 0 || upcoming.length > 0;

  return (
    <article className="upcoming-due-grouped">
      <div className="upcoming-due-grouped__header">
        <h2>Vencimientos</h2>
        <button 
          type="button" 
          onClick={onSeeAll} 
          style={{ backgroundColor: "#f9bc20", color:"black", "border": "1px solid #fffbef" }}
        >
          Ver todos
        </button>
      </div>

      {!hasItems && (
        <p className="upcoming-due-grouped__empty">Sin vencimientos próximos</p>
      )}

      {hasItems && (
        <div className="upcoming-due-grouped__list">
          {overdue.length > 0 && (
            <>
              <div className="upcoming-due-grouped__section-title">Vencidos</div>
              {overdue.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="upcoming-due-grouped__row upcoming-due-grouped__row--overdue"
                  onClick={() => onOpenProperty(item.id)}
                >
                  <div className="upcoming-due-grouped__info">
                    <div className="upcoming-due-grouped__property">{item.building} · Piso {item.floor}</div>
                    <div className="upcoming-due-grouped__tenant">{item.tenant || "Sin inquilino"}</div>
                  </div>
                  <div className="upcoming-due-grouped__label upcoming-due-grouped__label--overdue">
                    {getDueLabel(item.daysToDue)}
                  </div>
                </button>
              ))}
            </>
          )}

          {upcoming.length > 0 && (
            <>
              <div className="upcoming-due-grouped__section-title">Próximos</div>
              {upcoming.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="upcoming-due-grouped__row"
                  onClick={() => onOpenProperty(item.id)}
                >
                  <div className="upcoming-due-grouped__info">
                    <div className="upcoming-due-grouped__property">{item.building} · Piso {item.floor}</div>
                    <div className="upcoming-due-grouped__tenant">{item.tenant || "Sin inquilino"}</div>
                  </div>
                  <div className="upcoming-due-grouped__label">
                    {getDueLabel(item.daysToDue)}
                  </div>
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </article>
  );
}
