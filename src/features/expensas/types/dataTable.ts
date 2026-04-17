import type { Tenant } from "./expensas";

export interface DataTableProps {
  tenants: Tenant[];
  perPage?: number;
  onVerDetalle?: (tenant: Tenant) => void;
}
