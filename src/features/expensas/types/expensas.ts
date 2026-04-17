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