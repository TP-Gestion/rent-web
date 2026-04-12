export const PER_PAGE = 10;

export const EXPENSAS_PERIOD_LABEL = "MARZO 2026";

const ALL_TENANTS = [
  { id: "8829-K", name: "Agustín Moreno", property: "Torre Solaris I - Piso 12B", propertyType: "Residencial", status: "pagado", dueDate: "10 Mar 2026", amount: 145000 },
  { id: "4102-G", name: "Lucía Ramírez", property: "Torre Solaris II - Piso 4A", propertyType: "Residencial", status: "pendiente", dueDate: "15 Mar 2026", amount: 112400 },
  { id: "9910-K", name: "Javier Riva", property: "Torre Solaris I - Piso 2D", propertyType: "Comercial", status: "vencido", dueDate: "05 Mar 2026", amount: 280000 },
  { id: "3345-L", name: "Sonia Fernández", property: "Torre Solaris I - Piso 8C", propertyType: "Residencial", status: "pagado", dueDate: "10 Mar 2026", amount: 138500 },
  { id: "2201-A", name: "Marcos Ibáñez", property: "Torre Solaris II - Piso 6B", propertyType: "Comercial", status: "pendiente", dueDate: "18 Mar 2026", amount: 95000 },
  { id: "5567-B", name: "Valentina Cruz", property: "Torre Solaris I - Piso 3A", propertyType: "Residencial", status: "pagado", dueDate: "10 Mar 2026", amount: 122000 },
  { id: "7712-C", name: "Diego Herrera", property: "Torre Solaris II - Piso 9D", propertyType: "Residencial", status: "vencido", dueDate: "01 Mar 2026", amount: 167000 },
  { id: "6634-D", name: "Camila Ortega", property: "Torre Solaris I - Piso 5C", propertyType: "Residencial", status: "pagado", dueDate: "10 Mar 2026", amount: 109000 },
  { id: "1198-E", name: "Rodrigo Méndez", property: "Torre Solaris II - Piso 2A", propertyType: "Comercial", status: "pendiente", dueDate: "20 Mar 2026", amount: 215000 },
  { id: "4423-F", name: "Florencia Vidal", property: "Torre Solaris I - Piso 11B", propertyType: "Residencial", status: "pagado", dueDate: "10 Mar 2026", amount: 131000 },
];

const STATS = [
  { label: "Total Facturado", value: "$4,280,000", badge: "+12%", variant: "default" },
  { label: "Cobrado", value: "$2,850,000", badge: "66% del total", variant: "success" },
  { label: "Pendiente", value: "$940,000", badge: "14 en mora", variant: "warning", description: "14 inquilinos en mora" },
  { label: "Vencido", value: "$490,000", badge: "Crítico +30 días", variant: "danger" },
];

const MOROSITY_DATA = {
  percentage: 12.4,
  trend: "up",
  trendLabel: "crítico",
  description:
    "Se detectó un incremento del 4% en pagos fuera de término para el segmento comercial en Torre Solaris I. Se recomienda iniciar gestiones preventivas.",
};

const BATCH_ACTIONS_DATA = {
  pendingCount: 14,
  lastSyncLabel: "Hace 2hs",
};

export function getAllTenants() {
  return ALL_TENANTS;
}

export function getExpensasStats() {
  return STATS;
}

export function getMorosityData() {
  return MOROSITY_DATA;
}

export function getBatchActionsData() {
  return BATCH_ACTIONS_DATA;
}