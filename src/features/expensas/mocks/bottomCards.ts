import type { MorosityTrend } from "../types/bottomCards";

export const MOROSITY_DEFAULTS: {
  percentage: number;
  trend: MorosityTrend;
  trendLabel: string;
  description: string;
} = {
  percentage: 12.4,
  trend: "up",
  trendLabel: "crítico",
  description:
    "Se detectó un incremento del 4% en pagos fuera de término para el segmento comercial en Torre Solaris I. Se recomienda iniciar gestiones preventivas.",
};

export const BATCH_ACTIONS_DEFAULTS = {
  pendingCount: 14,
  lastSyncLabel: "Hace 2hs",
  version: "SOLARIS v2.6.0 · Enterprise Edition",
};

export const BOTTOM_CARDS_COPY = {
  morosityRegionLabel: "Análisis de rendimiento - Índice de morosidad",
  morositySectionLabel: "Análisis de Rendimiento",
  morosityTitle: "Índice de Morosidad",
  viewReportLabel: "Ver informe",
  configureAlertsLabel: "Configurar alertas",
  batchRegionLabel: "Acciones de lote",
  batchSectionLabel: "Acciones de Lote",
  sendRemindersTitle: "Enviar recordatorios",
  reconcileBanksTitle: "Conciliar bancos",
  pendingDetectedSuffix: "pendientes detectados",
  lastSyncPrefix: "Última sync:",
};
