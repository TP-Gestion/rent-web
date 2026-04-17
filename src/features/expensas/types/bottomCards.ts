export type MorosityTrend = "up" | "down" | "neutral";

export interface MorosityCardProps {
  percentage?: number;
  trend?: MorosityTrend;
  trendLabel?: string;
  description?: string;
  onVerInforme?: () => void;
  onConfigurar?: () => void;
}

export interface BatchActionsCardProps {
  pendingCount?: number;
  lastSyncLabel?: string;
  onSendReminders?: () => void;
  onReconcileBank?: () => void;
  version?: string;
}
