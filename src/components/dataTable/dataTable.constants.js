export const BADGE_STYLES = {
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

export const TABS = [
  { key: "todos", label: "Todos" },
  { key: "pagados", label: "Pagados" },
  { key: "pendientes", label: "Pendientes" },
  { key: "vencidos", label: "Vencidos" },
];

export const COL_HEADERS = ["Inquilino", "Propiedad", "Estado", "Vencimiento", "Monto", "Acción"];

export const BUILDING_OPTIONS = [
  { value: "todos", label: "Todos los edificios" },
  { value: "torres-este", label: "Torres del Este" },
  { value: "solaris-i", label: "Torre Solaris I" },
  { value: "solaris-ii", label: "Torre Solaris II" },
];