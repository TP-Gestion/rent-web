import type { FilterState, Tenant, TenantStatus } from "../types/expensas";

export type {
  BatchActionsData,
  FilterState,
  MorosityData,
  Stat,
  StatVariant,
  Tenant,
  TenantStatus,
} from "../types/expensas";

const STATUS_MAP: Record<string, TenantStatus> = {
  pagados: "pagado",
  pendientes: "pendiente",
  vencidos: "vencido",
};

const BUILDING_MAP: Record<string, string> = {
  "solaris-i": "Torre Solaris I",
  "solaris-ii": "Torre Solaris II",
  "torres-este": "Torres del Este",
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
    const buildingLabel = BUILDING_MAP[filters.building];
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