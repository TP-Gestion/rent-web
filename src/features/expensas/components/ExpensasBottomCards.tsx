import type { ReactNode, CSSProperties } from "react";
import styles from "./ExpensasBottomCards.module.css";

interface MorosityCardProps {
  percentage?: number;
  trend?: "up" | "down" | "neutral";
  trendLabel?: string;
  description?: string;
  onVerInforme?: () => void;
  onConfigurar?: () => void;
}

interface BatchActionsCardProps {
  pendingCount?: number;
  lastSyncLabel?: string;
  onSendReminders?: () => void;
  onReconcileBank?: () => void;
  version?: string;
}

function EnvelopeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="3" width="14" height="10" rx="2" fill="#D4A017" opacity="0.25" />
      <rect x="1" y="3" width="14" height="10" rx="2" stroke="#D4A017" strokeWidth="1.3" fill="none" />
      <path d="M1.5 4.5l6.5 5 6.5-5" stroke="#D4A017" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function SyncIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M13.5 8A5.5 5.5 0 012.5 8" stroke="#D4A017" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      <path
        d="M2.5 8A5.5 5.5 0 0113.5 8"
        stroke="#D4A017"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeDasharray="2 2"
        fill="none"
      />
      <path
        d="M11 5.5l2.5 2.5L16 5.5"
        stroke="#D4A017"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M5 10.5L2.5 8 0 10.5"
        stroke="#D4A017"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function ActionRow({ icon, title, subtitle, onClick }: { icon: ReactNode; title: string; subtitle: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} className={styles.actionRow} aria-label={title}>
      <div className={styles.actionIconWrap}>{icon}</div>

      <div className={styles.actionText}>
        <div className={styles.actionTitle}>{title}</div>
        <div className={styles.actionSubtitle}>{subtitle}</div>
      </div>

      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={styles.actionArrow}>
        <path d="M5 3l4 4-4 4" stroke="#D4A017" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

export function MorosityCard({
  percentage = 12.4,
  trend = "up",
  trendLabel = "crítico",
  description = "Se detectó un incremento del 4% en pagos fuera de término para el segmento comercial en Torre Solaris I. Se recomienda iniciar gestiones preventivas.",
  onVerInforme,
  onConfigurar,
}: MorosityCardProps) {
  const isUp = trend === "up";
  const trendColor = isUp ? "#a33030" : "#2e7d4f";
  const trendBg = isUp ? "#fdf0f0" : "#eaf6ef";
  const trendArrow = isUp ? "↑" : trend === "down" ? "↓" : "→";

  return (
    <div className={styles.morosityCard} role="region" aria-label="Análisis de rendimiento - Índice de morosidad">
      <div>
        <div className={`${styles.sectionLabel} ${styles.morosityHeaderLabel}`}>Análisis de Rendimiento</div>
        <div className={styles.morosityTitle}>Índice de Morosidad</div>
      </div>

      <div className={styles.morosityPercentageRow}>
        <span className={styles.morosityPercentage}>{percentage.toFixed(1)}%</span>
        <span
          className={styles.morosityTrendPill}
          style={{ "--trend-color": trendColor, "--trend-bg": trendBg } as CSSProperties}
        >
          {trendArrow} {trendLabel}
        </span>
      </div>

      <p className={styles.morosityDescription}>{description}</p>

      <div className={styles.morosityActions}>
        <button onClick={onVerInforme} className={`${styles.button} ${styles.buttonPrimary}`}>
          Ver informe
        </button>
        <button onClick={onConfigurar} className={`${styles.button} ${styles.buttonSecondary}`}>
          Configurar alertas
        </button>
      </div>
    </div>
  );
}

export function BatchActionsCard({
  pendingCount = 14,
  lastSyncLabel = "Hace 2hs",
  onSendReminders,
  onReconcileBank,
  version = "SOLARIS v2.6.0 · Enterprise Edition",
}: BatchActionsCardProps) {
  return (
    <div className={styles.batchActionsCard} role="region" aria-label="Acciones de lote">
      <div className={`${styles.sectionLabel} ${styles.batchHeaderLabel}`}>Acciones de Lote</div>

      <ActionRow
        icon={<EnvelopeIcon />}
        title="Enviar recordatorios"
        subtitle={`${pendingCount} pendientes detectados`}
        onClick={onSendReminders}
      />

      <ActionRow
        icon={<SyncIcon />}
        title="Conciliar bancos"
        subtitle={`Última sync: ${lastSyncLabel}`}
        onClick={onReconcileBank}
      />

      <div className={styles.batchVersion}>{version}</div>
    </div>
  );
}