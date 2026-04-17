export type TenantStatus = "pagado" | "pendiente" | "vencido";

export interface Tenant {
  id: string;
  name: string;
  property: string;
  propertyType: string;
  status: TenantStatus;
  dueDate: string;
  amount: number;
}

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

export interface FilterState {
  tab: string;
  building: string;
}

const STATUS_MAP: Record<string, TenantStatus> = {
  pagados: "pagado",
  pendientes: "pendiente",
  vencidos: "vencido",
};

export function filterTenants(tenants: Tenant[], filters: FilterState): Tenant[] {
  let filtered = [...tenants];

  if (filters.tab !== "todos") {
    const mappedStatus = STATUS_MAP[filters.tab];
    if (mappedStatus) {
      filtered = filtered.filter((tenant) => tenant.status === mappedStatus);
    }
  }

  if (filters.building !== "todos") {
    const buildingMap: Record<string, string | null> = {
      "solaris-i": "Torre Solaris I",
      "solaris-ii": "Torre Solaris II",
      "torres-este": null,
    };

    const buildingLabel = buildingMap[filters.building];
    if (buildingLabel) {
      filtered = filtered.filter((tenant) => tenant.property.startsWith(buildingLabel));
    }
  }

  return filtered;
}

export function formatArsAmount(amount: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getInitials(name = ""): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}