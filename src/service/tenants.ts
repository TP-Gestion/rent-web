import { apiClient } from "./client";
import type { ApiResponse } from "./client";

export interface UpdateTenantRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface TenantSummaryProperty {
  id: number;
  building: string;
  floor: string;
  unitType: string;
  status: string;
  dueDate: string;
  expenses: number;
  rentalAmount: number;
}

export interface TenantSummary {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  pendingAmount: number;
  properties: TenantSummaryProperty[];
}

const MOCK_TENANT_SUMMARY: TenantSummary = {
  firstName: "Juan",
  lastName: "Perez",
  email: "juan.perez@mail.com",
  phone: "1155555203",
  pendingAmount: 5000,
  properties: [
    {
      id: 1,
      building: "Torre Solaris II",
      floor: "12",
      unitType: "LOCAL",
      status: "OVERDUE",
      dueDate: "2026-03-05",
      expenses: 231313,
      rentalAmount: 31231133,
    },
    {
      id: 2,
      building: "Avellaneda",
      floor: "5",
      unitType: "DEPTO",
      status: "PAID",
      dueDate: "2026-04-01",
      expenses: 120000,
      rentalAmount: 900000,
    },
  ],
};

export async function getTenantSummary(
  tenantId: number,
): Promise<ApiResponse<TenantSummary>> {
  const { data } = await apiClient.get<ApiResponse<TenantSummary>>(
    `/tenants/${tenantId}/summary`,
  );
  return data;
}

export async function updateTenant(
  tenantId: number,
  body: UpdateTenantRequest,
): Promise<void> {
  await apiClient.put(`/tenants/${tenantId}`, body);
}

export async function deleteTenant(tenantId: number): Promise<void> {
  await apiClient.delete(`/tenants/${tenantId}`);
}
