import { useQuery } from "@tanstack/react-query";
import { getTenantSummary } from "../service/tenants";
import type { TenantSummary } from "../service/tenants";
import type { ApiResponse } from "../service/client";

export function useTenantSummary(tenantId: number | null | undefined) {
  return useQuery<ApiResponse<TenantSummary>>({
    queryKey: ["tenant-summary", tenantId],
    queryFn: () => getTenantSummary(tenantId!),
    enabled: tenantId != null,
  });
}
