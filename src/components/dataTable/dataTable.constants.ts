export type EstadoDisplay = "PAGADO" | "PENDIENTE" | "VENCIDO" | "LIBRE";

interface BadgeStyle {
  bg: string;
  color: string;
  label: string;
}

export const BADGE_STYLES: Record<EstadoDisplay, BadgeStyle> = {
  PAGADO: { bg: "#e6f6ee", color: "#1a6b3a", label: "PAGADO" },
  PENDIENTE: { bg: "#fff4d6", color: "#8a5a00", label: "PENDIENTE" },
  VENCIDO: { bg: "#fdecea", color: "#b02020", label: "VENCIDO" },
  LIBRE: { bg: "#e8f0fe", color: "#1a56b0", label: "LIBRE" },
};

export interface AvatarColor {
  bg: string;
  color: string;
}

export const AVATAR_COLORS: AvatarColor[] = [
  { bg: "#e6f1fb", color: "#185FA5" },
  { bg: "#fff8e6", color: "#9A6F00" },
  { bg: "#fdf0f0", color: "#a33030" },
  { bg: "#eaf6ef", color: "#2e7d4f" },
  { bg: "#f3e6fb", color: "#6a3a9a" },
];

export interface Tab {
  key: string;
  label: string;
}

export const TABS: Tab[] = [
  { key: "todos", label: "Todos" },
  { key: "PAGADO", label: "Pagados" },
  { key: "PENDIENTE", label: "Pendientes" },
  { key: "VENCIDO", label: "Vencidos" },
  { key: "LIBRE", label: "Libres" },
];

export const COL_HEADERS: string[] = [
  "Inquilino",
  "Propiedad",
  "Estado",
  "Vencimiento",
  "Monto",
  "Acción",
];

export interface BuildingOption {
  value: string;
  label: string;
}
