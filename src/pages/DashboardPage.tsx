import { useMemo } from "react";
import { useNavigate } from "react-router";
import {
  DashboardHero,
  DashboardStats,
  QuickActionsCard,
  RecentActivityCard,
  RisksCard,
  UpcomingDueCard,
  type DashboardStat,
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

  const dueDate = new Date(dateValue);
  if (Number.isNaN(dueDate.getTime())) return null;

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
  if (Number.isFinite(item.montoTotal) && item.montoTotal > 0) return item.montoTotal;
  return (item.montoAlquiler || 0) + (item.expensas || 0);
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { data: propiedades = [], isLoading, isError } = usePropiedades();

  const morosityData = getMorosityData();
  const batchActionsData = getBatchActionsData();

  const metrics = useMemo(() => {
    const totalUnits = propiedades.length;
    const occupied = propiedades.filter((p) => p.estadoOcupacion === "OCUPADO").length;
    const available = totalUnits - occupied;
    const overdue = propiedades.filter((p) => p.estadoPago === "VENCIDO").length;
    const pending = propiedades.filter((p) => p.estadoPago === "PENDIENTE").length;

    const billedAmount = propiedades.reduce((sum, item) => sum + resolveAmount(item), 0);
    const occupancyRate = totalUnits > 0 ? Math.round((occupied / totalUnits) * 100) : 0;

    return {
      totalUnits,
      occupied,
      available,
      overdue,
      pending,
      billedAmount,
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
      .filter((item) => item.daysToDue !== null && item.daysToDue <= 7)
      .sort((a, b) => (a.daysToDue ?? 0) - (b.daysToDue ?? 0))
      .slice(0, 6);
  }, [propiedades]);

  const stats: DashboardStat[] = [
    {
      label: "Unidades",
      value: String(metrics.totalUnits),
      badge: `${metrics.occupied} ocupadas`,
      variant: "default" as const,
    },
    {
      label: "Ocupación",
      value: `${metrics.occupancyRate}%`,
      badge: `${metrics.available} libres`,
      variant: "success" as const,
    },
    {
      label: "Facturación mensual",
      value: formatCurrency(metrics.billedAmount),
      badge: EXPENSAS_PERIOD_LABEL,
      variant: "default" as const,
    },
    {
      label: "Riesgo de cobro",
      value: `${metrics.overdue} vencidos`,
      badge: `${metrics.pending} pendientes`,
      variant: metrics.overdue > 0 ? ("warning" as const) : ("success" as const),
    },
  ];

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
          <DashboardStats stats={stats} />

          <section className="dashboard-page__main-grid">
            <UpcomingDueCard
              items={upcomingDueItems}
              onSeeAll={() => navigate("/tenants")}
              onOpenProperty={(propertyId) => navigate(`/propiedades/${propertyId}`)}
              getDueLabel={buildDueLabel}
            />

            <QuickActionsCard
              onNewProperty={() => navigate("/nueva-propiedad")}
              onNewExpense={() => navigate("/finances")}
              onLiquidation={() => navigate("/maintenance")}
              onReminders={() => navigate("/tenants")}
            />
          </section>

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
