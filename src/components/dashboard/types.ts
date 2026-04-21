import type { EstadoPago } from "../../service/propiedades";
import type { StatVariant } from "../../propiedadService";

export interface DashboardStat {
  label: string;
  value: string;
  badge: string;
  variant: StatVariant;
}

export interface UpcomingDueItem {
  id: number;
  building: string;
  floor: string;
  tenant: string;
  status: EstadoPago;
  daysToDue: number | null;
}
