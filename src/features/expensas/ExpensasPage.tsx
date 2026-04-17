import { useNavigate } from "react-router";
import ExpensasStatCard from "./components/ExpensasStatCard";
import ExpensasDataTable from "./components/ExpensasDataTable";
import { MorosityCard, BatchActionsCard } from "./components/ExpensasBottomCards";
import {
  EXPENSAS_PERIOD_LABEL,
  getAllTenants,
  getBatchActionsData,
  getExpensasStats,
  getMorosityData,
} from "./services/expensasService";
import styles from "./ExpensasPage.module.css";

const ALL_TENANTS = getAllTenants();
const STATS = getExpensasStats();
const MOROSITY_DATA = getMorosityData();
const BATCH_ACTIONS_DATA = getBatchActionsData();

function HeaderButton({
  label,
  primary,
  onClick,
}: {
  label: string;
  primary?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`${styles.headerButton} ${primary ? styles.headerButtonPrimary : ""}`}
    >
      {label}
    </button>
  );
}

export default function ExpensasPage() {
  const navigate = useNavigate();

  const handleExportar = () => {
    alert("Exportando reporte de Marzo 2026...");
  };

  const handleGenerarLiquidacion = () => {
    alert("Generando liquidación...");
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <div className={styles.sectionLabel}>Administración de Cartera</div>
          <h1 className={styles.title}>Expensas de Inquilinos</h1>
          <div className={styles.period}>PERIODO: {EXPENSAS_PERIOD_LABEL}</div>
        </div>
        <div className={styles.headerActions}>
          <HeaderButton label="↓  Exportar reporte" onClick={handleExportar} />
          <HeaderButton label="＋ Nueva Propiedad" onClick={() => navigate("/nueva-propiedad")} />
          <HeaderButton label="+ Generar liquidación" primary onClick={handleGenerarLiquidacion} />
        </div>
      </div>

      <div className={styles.statsGrid}>
        {STATS.map((stat) => (
          <ExpensasStatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            badge={stat.badge}
            variant={stat.variant}
          />
        ))}
      </div>

      <ExpensasDataTable tenants={ALL_TENANTS} perPage={10} onVerDetalle={(tenant) => navigate(`/propiedades/${tenant.id}`)} />

      <div className={styles.bottomGrid}>
        <MorosityCard
          percentage={MOROSITY_DATA.percentage}
          trend={MOROSITY_DATA.trend}
          trendLabel={MOROSITY_DATA.trendLabel}
          description={MOROSITY_DATA.description}
          onVerInforme={() => alert("Abriendo informe de morosidad...")}
          onConfigurar={() => alert("Abriendo configuración de alertas...")}
        />
        <BatchActionsCard
          pendingCount={BATCH_ACTIONS_DATA.pendingCount}
          lastSyncLabel={BATCH_ACTIONS_DATA.lastSyncLabel}
          onSendReminders={() => alert("Enviando recordatorios a 14 inquilinos...")}
          onReconcileBank={() => alert("Iniciando conciliación bancaria...")}
        />
      </div>
    </div>
  );
}