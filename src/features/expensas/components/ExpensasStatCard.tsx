import type { StatVariant } from "../types/expensas";
import styles from "./ExpensasStatCard.module.css";

interface StatCardProps {
  label: string;
  value: string;
  badge?: string;
  variant: StatVariant;
}

export default function ExpensasStatCard({ label, value, badge, variant }: StatCardProps) {
  return (
    <div className={`${styles.card} ${styles[variant]}`}>
      <div className={styles.accentBar} />
      <div className={styles.label}>{label}</div>
      <div className={styles.valueRow}>
        <span className={styles.value}>{value}</span>
        {badge && <span className={styles.badge}>{badge}</span>}
      </div>
    </div>
  );
}