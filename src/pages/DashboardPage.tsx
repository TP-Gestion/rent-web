import { useMemo } from "react";
import { useNavigate } from "react-router";
import {
  DashboardHero,
  StatCardLarge,
  UpcomingDueCardGrouped,
  RecentActivityCard,
  RisksCard,
  type UpcomingDueItem,
} from "../components/dashboard";
import { usePropiedades } from "../hooks/usePropiedades";
import {
  EXPENSAS_PERIOD_LABEL,
  getBatchActionsData,
  getMorosityData,
} from "../propiedadService";
import type { PropiedadListItem } from "../service/propiedades";
import "./DashboardPage.css";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
}

function getDaysToDue(dateValue: string | null): number | null {
  if (!dateValue) return null;

  // Parse date in YYYY-MM-DD format as local date, not UTC
  const [year, month, day] = dateValue.split('-').map(Number);
  if (!year || !month || !day) return null;

  const dueDate = new Date(year, month - 1, day);
  const today = new Date();
  
  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);

  const dayMs = 1000 * 60 * 60 * 24;
  return Math.round((dueDate.getTime() - today.getTime()) / dayMs);
}

function buildDueLabel(daysToDue: number | null): string {
  if (daysToDue == null) return "Sin fecha";
  if (daysToDue < 0) return `Vencido hace ${Math.abs(daysToDue)} día(s)`;
  if (daysToDue === 0) return "Vence hoy";
  return `Vence en ${daysToDue} día(s)`;
}

function resolveAmount(item: PropiedadListItem): number {
  if (Number.isFinite(item.montoTotal) && item.montoTotal > 0)
    return item.montoTotal;
  return (item.montoAlquiler || 0) + (item.expensas || 0);
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { data: propiedades = [], isLoading, isError } = usePropiedades();

  const morosityData = getMorosityData();
  const batchActionsData = getBatchActionsData();

  const metrics = useMemo(() => {
    const totalUnits = propiedades.length;
    const occupied = propiedades.filter(
      (p) => p.estadoOcupacion === "OCCUPIED",
    ).length;
    const available = totalUnits - occupied;
    const overdue = propiedades.filter(
      (p) => p.estadoPago === "OVERDUE",
    ).length;
    const pending = propiedades.filter(
      (p) => p.estadoPago === "PENDING",
    ).length;

    const billedAmount = propiedades.reduce(
      (sum, item) => sum + resolveAmount(item),
      0,
    );
    const collectedAmount = propiedades
      .filter((p) => p.estadoPago === "PAID")
      .reduce((sum, item) => sum + resolveAmount(item), 0);
    const pendingAmount = propiedades
      .filter((p) => p.estadoPago === "PENDING")
      .reduce((sum, item) => sum + resolveAmount(item), 0);
    const overdueAmount = propiedades
      .filter((p) => p.estadoPago === "OVERDUE")
      .reduce((sum, item) => sum + resolveAmount(item), 0);
    const occupancyRate =
      totalUnits > 0 ? Math.round((occupied / totalUnits) * 100) : 0;

    return {
      totalUnits,
      occupied,
      available,
      overdue,
      pending,
      billedAmount,
      collectedAmount,
      pendingAmount,
      overdueAmount,
      occupancyRate,
    };
  }, [propiedades]);

  const upcomingDueItems = useMemo<UpcomingDueItem[]>(() => {
    return propiedades
      .map((item) => ({
        id: item.id,
        building: item.edificio,
        floor: item.piso,
        tenant: item.nombreInquilino,
        status: item.estadoPago,
        daysToDue: getDaysToDue(item.fechaVencimiento),
      }))
      .filter((item) => item.daysToDue !== null && item.daysToDue >= -7 && item.daysToDue <= 7)
      .sort((a, b) => (a.daysToDue ?? 0) - (b.daysToDue ?? 0))
      .slice(0, 10);
  }, [propiedades]);

  return (
    <div className="dashboard-page">
      <DashboardHero periodLabel={EXPENSAS_PERIOD_LABEL} />

      {isError && (
        <div className="dashboard-page__feedback dashboard-page__feedback--error">
          No se pudieron cargar los datos para el dashboard.
        </div>
      )}

      {isLoading && (
        <div className="dashboard-page__feedback">Cargando métricas...</div>
      )}

      {!isLoading && !isError && (
        <>
          {/* PRIMARY KPIs - 3 COLUMNAS COMPACTAS */}
          <section className="dashboard-page__kpi-section">
            <StatCardLarge
              label="Ocupación"
              value={`${metrics.occupancyRate}%`}
              badge={`${metrics.occupied}/${metrics.totalUnits}`}
              progressValue={metrics.occupancyRate}
              indicator={metrics.occupancyRate >= 80 ? "up" : metrics.occupancyRate >= 50 ? "neutral" : "down"}
              indicatorLabel={metrics.occupancyRate >= 80 ? "Saludable" : metrics.occupancyRate >= 50 ? "Normal" : "Bajo"}
              variant="success"
            />
            <StatCardLarge
              label="Cobrado"
              value={formatCurrency(metrics.collectedAmount)}
              badge="Último período"
              indicator={metrics.collectedAmount >= metrics.billedAmount * 0.8 ? "up" : "neutral"}
              indicatorLabel={metrics.collectedAmount >= metrics.billedAmount * 0.8 ? "En línea" : "Por debajo"}
              variant="success"
            />
            <StatCardLarge
              label="⚠️ Vencido"
              value={formatCurrency(metrics.overdueAmount)}
              badge={`${metrics.overdue} unidades`}
              indicator={metrics.overdue > 0 ? "down" : "neutral"}
              indicatorLabel={metrics.overdue > 0 ? "Requiere atención" : "Sin vencidos"}
              variant={metrics.overdue > 0 ? "warning" : "success"}
            />
          </section>

          {/* SECONDARY METRICS - COMPACT & DISCRETE */}
          <section className="dashboard-page__secondary-metrics-compact">
            <div className="dashboard-page__secondary-card-compact">
              <div className="dashboard-page__secondary-label-compact">Unidades</div>
              <div className="dashboard-page__secondary-value-compact">{metrics.totalUnits}</div>
              <div className="dashboard-page__secondary-badge-compact">{metrics.occupied} ocupadas</div>
            </div>
            <div className="dashboard-page__secondary-card-compact">
              <div className="dashboard-page__secondary-label-compact">Facturación Esperada</div>
              <div className="dashboard-page__secondary-value-compact">{formatCurrency(metrics.billedAmount)}</div>
              <div className="dashboard-page__secondary-badge-compact">{EXPENSAS_PERIOD_LABEL}</div>
            </div>
            <div className="dashboard-page__secondary-card-compact">
              <div className="dashboard-page__secondary-label-compact">Pendiente de Cobro</div>
              <div className="dashboard-page__secondary-value-compact">{formatCurrency(metrics.pendingAmount)}</div>
              <div className="dashboard-page__secondary-badge-compact">{metrics.pending} unidades</div>
            </div>
            <div className="dashboard-page__secondary-card-compact">
              <div className="dashboard-page__secondary-label-compact">Morosidad</div>
              <div className="dashboard-page__secondary-value-compact">{getMorosityData().percentage}%</div>
              <div className="dashboard-page__secondary-badge-compact">{getMorosityData().trendLabel}</div>
            </div>
          </section>

          <section className="dashboard-page__upcoming-section">
            <UpcomingDueCardGrouped
              items={upcomingDueItems}
              onSeeAll={() => navigate("/tenants")}
              onOpenProperty={(propertyId) =>
                navigate(`/propiedades/${propertyId}`)
              }
              getDueLabel={buildDueLabel}
            />
          </section>

          {/* ALERTS & ACTIVITY - 2 Columns */}
          <section className="dashboard-page__bottom-grid">
            <RisksCard
              morosityPercentage={morosityData.percentage}
              morosityTrendLabel={morosityData.trendLabel}
              overdueUnits={metrics.overdue}
              pendingBatchActions={batchActionsData.pendingCount}
              lastSyncLabel={batchActionsData.lastSyncLabel}
            />

            <RecentActivityCard
              periodLabel={EXPENSAS_PERIOD_LABEL}
              lastSyncLabel={batchActionsData.lastSyncLabel}
              pendingUnits={metrics.pending}
            />
          </section>
        </>
      )}
    </div>
  );
}
