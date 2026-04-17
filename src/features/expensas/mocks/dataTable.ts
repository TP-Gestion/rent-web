import type { TenantStatus } from "../services/expensasService";

export const BADGE_STYLES: Record<TenantStatus, { bg: string; color: string; label: string }> = {
  pagado: { bg: "#eaf6ef", color: "#2e7d4f", label: "PAGADO" },
  pendiente: { bg: "#fff8e6", color: "#9A6F00", label: "PENDIENTE" },
  vencido: { bg: "#fdf0f0", color: "#a33030", label: "VENCIDO" },
};

export const AVATAR_COLORS = [
  { bg: "#e6f1fb", color: "#185FA5" },
  { bg: "#fff8e6", color: "#9A6F00" },
  { bg: "#fdf0f0", color: "#a33030" },
  { bg: "#eaf6ef", color: "#2e7d4f" },
  { bg: "#f3e6fb", color: "#6a3a9a" },
];

export const EMPTY_RESULTS_LABEL = "No se encontraron resultados";
