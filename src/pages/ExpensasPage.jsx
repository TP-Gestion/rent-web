import { useState, useEffect } from "react";
import StatCard from "../components/StatCard";
import DataTable from "../components/dataTable/DataTable";
import { MorosityCard, BatchActionsCard } from "../components/BottomCards";
import {
  EXPENSAS_PERIOD_LABEL,
  PER_PAGE,
  getAllTenants,
  getBatchActionsData,
  getExpensasStats,
  getMorosityData,
} from "../propiedadService";
import "./ExpensasPage.css";

// Botones de header
function HeaderButton({ label, primary, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`expensas-header-button${primary ? " expensas-header-button--primary" : ""}`}
    >
      {label}
    </button>
  );
}

// ExpensasPage
export default function ExpensasPage() {
  const allTenants = getAllTenants();
  const stats = getExpensasStats();
  const morosityData = getMorosityData();
  const batchActionsData = getBatchActionsData();

  const [filters, setFilters] = useState({ tab: "todos", building: "todos", page: 1 });
  const [visibleTenants, setVisibleTenants] = useState([]);
  const [totalResults, setTotalResults] = useState(0);

  // Filtra y pagina los tenants al cambiar filtros
  useEffect(() => {
    let filtered = [...allTenants];

    if (filters.tab !== "todos") {
      // "pendientes" → status "pendiente", etc.
      const statusMap = { pagados: "pagado", pendientes: "pendiente", vencidos: "vencido" };
      filtered = filtered.filter((t) => t.status === statusMap[filters.tab]);
    }

    if (filters.building !== "todos") {
      const buildingMap = {
        "solaris-i":  "Torre Solaris I",
        "solaris-ii": "Torre Solaris II",
        "torres-este": null, // muestra todos en este mock
      };
      const buildingStr = buildingMap[filters.building];
      if (buildingStr) {
        filtered = filtered.filter((t) => t.property.startsWith(buildingStr));
      }
    }

    setTotalResults(filtered.length);

    const start = (filters.page - 1) * PER_PAGE;
    setVisibleTenants(filtered.slice(start, start + PER_PAGE));
  }, [filters, allTenants]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleVerDetalle = (tenant) => {
    alert(`Ver detalle de: ${tenant.name}\nPropiedad: ${tenant.property}\nMonto: $${tenant.amount.toLocaleString("es-AR")}`);
  };

  const handleExportar = () => {
    alert("Exportando reporte de Marzo 2026...");
  };

  const handleGenerarLiquidacion = () => {
    alert("Generando liquidación...");
  };

  return (
    <div className="expensas-page">
      {/* ── Page Header ── */}
      <div className="expensas-page__header">
        <div>
          <div className="expensas-page__section-label">
            Administración de Cartera
          </div>
          <h1 className="expensas-page__title">
            Expensas de Inquilinos
          </h1>
          <div className="expensas-page__period">
            PERIODO: {EXPENSAS_PERIOD_LABEL}
          </div>
        </div>
        <div className="expensas-page__header-actions">
          <HeaderButton label="↓  Exportar reporte" onClick={handleExportar} />
          <HeaderButton label="+ Generar liquidación" primary onClick={handleGenerarLiquidacion} />
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="expensas-page__stats-grid">
        {stats.map((s) => (
          <StatCard
            label={s.label}
            value={s.value}
            badge={s.badge}
            variant={s.variant}
          />
        ))}
      </div>

      {/* ── Data Table ── */}
      <DataTable
        tenants={visibleTenants}
        totalResults={totalResults}
        perPage={PER_PAGE}
        onVerDetalle={handleVerDetalle}
        onFilterChange={handleFilterChange}
      />

      {/* ── Bottom Cards ── */}
      <div className="expensas-page__bottom-grid">
        <MorosityCard
          percentage={morosityData.percentage}
          trend={morosityData.trend}
          trendLabel={morosityData.trendLabel}
          description={morosityData.description}
          onVerInforme={() => alert("Abriendo informe de morosidad...")}
          onConfigurar={() => alert("Abriendo configuración de alertas...")}
        />
        <BatchActionsCard
          pendingCount={batchActionsData.pendingCount}
          lastSyncLabel={batchActionsData.lastSyncLabel}
          onSendReminders={() => alert("Enviando recordatorios a 14 inquilinos...")}
          onReconcileBank={() => alert("Iniciando conciliación bancaria...")}
        />
      </div>
    </div>
  );
}
