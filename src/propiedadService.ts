export const PER_PAGE = 10;

export const EXPENSAS_PERIOD_LABEL = "MARZO 2026";

export type StatVariant = "default" | "success" | "warning" | "danger";

export interface Stat {
  label: string;
  value: string;
  badge: string;
  variant: StatVariant;
  description?: string;
}

export interface MorosityData {
  percentage: number;
  trend: "up" | "down" | "neutral";
  trendLabel: string;
  description: string;
}

export interface BatchActionsData {
  pendingCount: number;
  lastSyncLabel: string;
}

const STATS: Stat[] = [
  {
    label: "Total Facturado",
    value: "$4,280,000",
    badge: "+12%",
    variant: "default",
  },
  {
    label: "Cobrado",
    value: "$2,850,000",
    badge: "66% del total",
    variant: "success",
  },
  {
    label: "Pendiente",
    value: "$940,000",
    badge: "14 en mora",
    variant: "warning",
    description: "14 inquilinos en mora",
  },
  {
    label: "Vencido",
    value: "$490,000",
    badge: "Crítico +30 días",
    variant: "danger",
  },
];

const MOROSITY_DATA: MorosityData = {
  percentage: 12.4,
  trend: "up",
  trendLabel: "crítico",
  description:
    "Se detectó un incremento del 4% en pagos fuera de término para el segmento comercial en Torre Solaris I. Se recomienda iniciar gestiones preventivas.",
};

const BATCH_ACTIONS_DATA: BatchActionsData = {
  pendingCount: 14,
  lastSyncLabel: "Hace 2hs",
};

export function getExpensasStats(): Stat[] {
  return STATS;
}

export function getMorosityData(): MorosityData {
  return MOROSITY_DATA;
}

export function getBatchActionsData(): BatchActionsData {
  return BATCH_ACTIONS_DATA;
}
