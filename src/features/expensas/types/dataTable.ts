import type { Tenant } from "../services/expensasService";

export interface DataTableProps {
  tenants: Tenant[];
  perPage?: number;
  onVerDetalle?: (tenant: Tenant) => void;
}
