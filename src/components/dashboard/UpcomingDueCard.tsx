import type { UpcomingDueItem } from "./types";

interface UpcomingDueCardProps {
  items: UpcomingDueItem[];
  onSeeAll: () => void;
  onOpenProperty: (propertyId: number) => void;
  getDueLabel: (daysToDue: number | null) => string;
}

export default function UpcomingDueCard({
  items,
  onSeeAll,
  onOpenProperty,
  getDueLabel,
}: UpcomingDueCardProps) {
  return (
    <article className="dashboard-card dashboard-card--wide">
      <div className="dashboard-card__header">
        <h2>Vencimientos próximos</h2>
        <button type="button" onClick={onSeeAll}>Ver todos</button>
      </div>

      {items.length === 0 ? (
        <p className="dashboard-card__empty">No hay vencimientos en los próximos 7 días.</p>
      ) : (
        <div className="dashboard-due-list">
          {items.map((item) => (
            <button
              type="button"
              key={item.id}
              className="dashboard-due-row"
              onClick={() => onOpenProperty(item.id)}
            >
              <div>
                <div className="dashboard-due-row__title">{item.building} · Piso {item.floor}</div>
                <div className="dashboard-due-row__sub">{item.tenant || "Sin inquilino asignado"}</div>
              </div>
              <span
                className={`dashboard-due-row__chip${item.status === "VENCIDO" ? " dashboard-due-row__chip--danger" : ""}`}
              >
                {getDueLabel(item.daysToDue)}
              </span>
            </button>
          ))}
        </div>
      )}
    </article>
  );
}
