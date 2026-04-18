import type { ReactNode, CSSProperties } from "react";
import ChevronRightIcon from "../icons/ChevronRightIcon";
import EnvelopeIcon from "../icons/EnvelopeIcon";
import SyncIcon from "../icons/SyncIcon";
import { useMorosityTrend } from "../hooks/useMorosityTrend";
import { BATCH_ACTIONS_DEFAULTS, BOTTOM_CARDS_COPY, MOROSITY_DEFAULTS } from "../mocks/bottomCards";
import type { BatchActionsCardProps, MorosityCardProps } from "../types/bottomCards";
import styles from "./ExpensasBottomCards.module.css";

function ActionRow({ icon, title, subtitle, onClick }: { icon: ReactNode; title: string; subtitle: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} className={styles.actionRow} aria-label={title}>
      <div className={styles.actionIconWrap}>{icon}</div>

      <div className={styles.actionText}>
        <div className={styles.actionTitle}>{title}</div>
        <div className={styles.actionSubtitle}>{subtitle}</div>
      </div>

      <ChevronRightIcon className={styles.actionArrow} />
    </button>
  );
}

export function MorosityCard({
  percentage = MOROSITY_DEFAULTS.percentage,
  trend = MOROSITY_DEFAULTS.trend,
  trendLabel = MOROSITY_DEFAULTS.trendLabel,
  description = MOROSITY_DEFAULTS.description,
  onVerInforme,
  onConfigurar,
}: MorosityCardProps) {
  const { trendColor, trendBg, trendArrow } = useMorosityTrend(trend);

  return (
    <div className={styles.morosityCard}>
      <div>
        <div className={`${styles.sectionLabel} ${styles.morosityHeaderLabel}`}>{BOTTOM_CARDS_COPY.morositySectionLabel}</div>
        <div className={styles.morosityTitle}>{BOTTOM_CARDS_COPY.morosityTitle}</div>
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
          {BOTTOM_CARDS_COPY.viewReportLabel}
        </button>
        <button onClick={onConfigurar} className={`${styles.button} ${styles.buttonSecondary}`}>
          {BOTTOM_CARDS_COPY.configureAlertsLabel}
        </button>
      </div>
    </div>
  );
}

export function BatchActionsCard({
  pendingCount = BATCH_ACTIONS_DEFAULTS.pendingCount,
  lastSyncLabel = BATCH_ACTIONS_DEFAULTS.lastSyncLabel,
  onSendReminders,
  onReconcileBank,
  version = BATCH_ACTIONS_DEFAULTS.version,
}: BatchActionsCardProps) {
  return (
    <div className={styles.batchActionsCard}>
      <div className={`${styles.sectionLabel} ${styles.batchHeaderLabel}`}>{BOTTOM_CARDS_COPY.batchSectionLabel}</div>

      <ActionRow
        icon={<EnvelopeIcon />}
        title={BOTTOM_CARDS_COPY.sendRemindersTitle}
        subtitle={`${pendingCount} ${BOTTOM_CARDS_COPY.pendingDetectedSuffix}`}
        onClick={onSendReminders}
      />

      <ActionRow
        icon={<SyncIcon />}
        title={BOTTOM_CARDS_COPY.reconcileBanksTitle}
        subtitle={`${BOTTOM_CARDS_COPY.lastSyncPrefix} ${lastSyncLabel}`}
        onClick={onReconcileBank}
      />

      <div className={styles.batchVersion}>{version}</div>
    </div>
  );
}