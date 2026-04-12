import { useState, useEffect } from "react";
import StatCard from "../components/StatCard";
import DataTable from "../components/DataTable";
import { MorosityCard, BatchActionsCard } from "../components/BottomCards";
import "./ExpensasPage.css";

// ─── Mock data ────────────────────────────────────────────────────────────────
const ALL_TENANTS = [
  { id: "8829-K", name: "Agustín Moreno",   property: "Torre Solaris I - Piso 12B",  propertyType: "Residencial", status: "pagado",   dueDate: "10 Mar 2026", amount: 145000 },
  { id: "4102-G", name: "Lucía Ramírez",    property: "Torre Solaris II - Piso 4A",  propertyType: "Residencial", status: "pendiente", dueDate: "15 Mar 2026", amount: 112400 },
  { id: "9910-K", name: "Javier Riva",      property: "Torre Solaris I - Piso 2D",   propertyType: "Comercial",   status: "vencido",   dueDate: "05 Mar 2026", amount: 280000 },
  { id: "3345-L", name: "Sonia Fernández",  property: "Torre Solaris I - Piso 8C",   propertyType: "Residencial", status: "pagado",   dueDate: "10 Mar 2026", amount: 138500 },
  { id: "2201-A", name: "Marcos Ibáñez",    property: "Torre Solaris II - Piso 6B",  propertyType: "Comercial",   status: "pendiente", dueDate: "18 Mar 2026", amount: 95000  },
  { id: "5567-B", name: "Valentina Cruz",   property: "Torre Solaris I - Piso 3A",   propertyType: "Residencial", status: "pagado",   dueDate: "10 Mar 2026", amount: 122000 },
  { id: "7712-C", name: "Diego Herrera",    property: "Torre Solaris II - Piso 9D",  propertyType: "Residencial", status: "vencido",   dueDate: "01 Mar 2026", amount: 167000 },
  { id: "6634-D", name: "Camila Ortega",    property: "Torre Solaris I - Piso 5C",   propertyType: "Residencial", status: "pagado",   dueDate: "10 Mar 2026", amount: 109000 },
  { id: "1198-E", name: "Rodrigo Méndez",   property: "Torre Solaris II - Piso 2A",  propertyType: "Comercial",   status: "pendiente", dueDate: "20 Mar 2026", amount: 215000 },
  { id: "4423-F", name: "Florencia Vidal",  property: "Torre Solaris I - Piso 11B",  propertyType: "Residencial", status: "pagado",   dueDate: "10 Mar 2026", amount: 131000 },
];

const STATS = [
  { label: "Total Facturado", value: "$4,280,000", badge: "+12%", variant: "default" },
  { label: "Cobrado",         value: "$2,850,000", badge: "66% del total",     variant: "success" },
  { label: "Pendiente",       value: "$940,000",   badge: "14 en mora",        variant: "warning", description: "14 inquilinos en mora" },
  { label: "Vencido",         value: "$490,000",   badge: "Crítico +30 días",  variant: "danger" },
];

const PER_PAGE = 10;

// ─── Botones de header ────────────────────────────────────────────────────────
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

// ─── ExpensasPage ─────────────────────────────────────────────────────────────
export default function ExpensasPage() {
  const [filters, setFilters] = useState({ tab: "todos", building: "todos", page: 1 });
  const [visibleTenants, setVisibleTenants] = useState([]);
  const [totalResults, setTotalResults] = useState(0);

  // Filtra y pagina los tenants al cambiar filtros
  useEffect(() => {
    let filtered = [...ALL_TENANTS];

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
  }, [filters]);

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
            PERIODO: MARZO 2026
          </div>
        </div>
        <div className="expensas-page__header-actions">
          <HeaderButton label="↓  Exportar reporte" onClick={handleExportar} />
          <HeaderButton label="+ Generar liquidación" primary onClick={handleGenerarLiquidacion} />
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="expensas-page__stats-grid">
        {STATS.map((s) => (
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
          percentage={12.4}
          trend="up"
          trendLabel="crítico"
          description="Se detectó un incremento del 4% en pagos fuera de término para el segmento comercial en Torre Solaris I. Se recomienda iniciar gestiones preventivas."
          onVerInforme={() => alert("Abriendo informe de morosidad...")}
          onConfigurar={() => alert("Abriendo configuración de alertas...")}
        />
        <BatchActionsCard
          pendingCount={14}
          lastSyncLabel="Hace 2hs"
          onSendReminders={() => alert("Enviando recordatorios a 14 inquilinos...")}
          onReconcileBank={() => alert("Iniciando conciliación bancaria...")}
        />
      </div>
    </div>
  );
}
