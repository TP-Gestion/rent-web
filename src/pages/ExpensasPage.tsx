import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import StatCard from "../components/StatCard";
import DataTable from "../components/dataTable/DataTable";
import { MorosityCard, BatchActionsCard } from "../components/bottomCards";
import type { PropiedadListItem } from "../service/propiedades";
import {
  EXPENSAS_PERIOD_LABEL,
  PER_PAGE,
  getBatchActionsData,
  getExpensasStats,
  getMorosityData,
} from "../propiedadService";
import { usePropiedades } from "../hooks/usePropiedades";
import "./ExpensasPage.css";

interface FilterState {
  tab: string;
  building: string;
  page: number;
}

interface HeaderButtonProps {
  label: string;
  primary?: boolean;
  onClick?: () => void;
}

function HeaderButton({ label, primary, onClick }: HeaderButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`expensas-header-button${primary ? " expensas-header-button--primary" : ""}`}
    >
      {label}
    </button>
  );
}

export default function ExpensasPage() {
  const navigate = useNavigate();
  const { data: propiedadesData } = usePropiedades();
  const propiedades = propiedadesData ?? [];
  const stats = getExpensasStats();
  const morosityData = getMorosityData();
  const batchActionsData = getBatchActionsData();

  const buildingOptions = useMemo(() => {
    const unique = [...new Set(propiedades.map((p) => p.edificio))];
    return [
      { value: "todos", label: "Todos los edificios" },
      ...unique.map((b) => ({ value: b, label: b })),
    ];
  }, [propiedades]);

  const [filters, setFilters] = useState<FilterState>({
    tab: "todos",
    building: "todos",
    page: 1,
  });

  const filteredItems = useMemo(() => {
    let filtered = [...propiedades];

    if (filters.tab !== "todos") {
      filtered = filtered.filter((p) => {
        const estado = p.estadoOcupacion === "LIBRE" ? "LIBRE" : p.estadoPago;
        return estado === filters.tab;
      });
    }

    if (filters.building !== "todos") {
      filtered = filtered.filter((p) => p.edificio === filters.building);
    }

    return filtered;
  }, [filters.tab, filters.building, propiedades]);

  const totalResults = filteredItems.length;

  const visibleItems = useMemo(() => {
    const start = (filters.page - 1) * PER_PAGE;
    return filteredItems.slice(start, start + PER_PAGE);
  }, [filteredItems, filters.page]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleVerDetalle = (item: PropiedadListItem) => {
    navigate(`/propiedades/${item.id}`);
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
          <h1 className="expensas-page__title">Expensas de Inquilinos</h1>
          <div className="expensas-page__period">
            PERIODO: {EXPENSAS_PERIOD_LABEL}
          </div>
        </div>
        <div className="expensas-page__header-actions">
          <HeaderButton label="↓  Exportar reporte" onClick={handleExportar} />
          <HeaderButton
            label="＋ Nueva Propiedad"
            onClick={() => navigate("/nueva-propiedad")}
          />
          <HeaderButton
            label="+ Generar liquidación"
            primary
            onClick={handleGenerarLiquidacion}
          />
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="expensas-page__stats-grid">
        {stats.map((s) => (
          <StatCard
            key={s.label}
            label={s.label}
            value={s.value}
            badge={s.badge}
            variant={s.variant}
          />
        ))}
      </div>

      {/* ── Data Table ── */}
      <DataTable
        items={visibleItems}
        totalResults={totalResults}
        perPage={PER_PAGE}
        buildingOptions={buildingOptions}
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
          onSendReminders={() =>
            alert("Enviando recordatorios a 14 inquilinos...")
          }
          onReconcileBank={() => alert("Iniciando conciliación bancaria...")}
        />
      </div>
    </div>
  );
}
