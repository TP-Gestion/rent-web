import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import DataTable from "../components/tenants/dataTable/DataTable";
import type { PropiedadListItem } from "../service/propiedades";
import {
  EXPENSAS_PERIOD_LABEL,
  PER_PAGE,
} from "../propiedadService";
import { usePropertiesSummary } from "../hooks/usePropertiesSummary";
import "./TenantsPage.css";

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

export default function TenantsPage() {
  const navigate = useNavigate();
  const { data: propiedadesData } = usePropertiesSummary();
  const propiedades = propiedadesData ?? [];


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
        const estado =
          p.estadoOcupacion === "AVAILABLE" ? "AVAILABLE" : p.estadoPago;
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
    alert("Extrayendo reporte de Marzo 2026...");
  };

  const handleGenerarLiquidacion = () => {
    navigate("/generar-liquidacion");
  };

  const handleEnviarRecordatorios = () => {
    alert("Enviando recordatorios a los inquilinos con saldo pendiente...");
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
          <HeaderButton
            label="Nueva propiedad"
            onClick={() => navigate("/nueva-propiedad")}
          />
          <HeaderButton
            label="Generar liquidación"
            primary
            onClick={handleGenerarLiquidacion}
          />
          <HeaderButton label="Extraer reporte" onClick={handleExportar} />
          <HeaderButton
            label="Enviar recordatorios"
            onClick={handleEnviarRecordatorios}
          />
        </div>
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
    </div>
  );
}
