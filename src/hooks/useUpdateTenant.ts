import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTenant, type UpdateTenantRequest } from "../service/tenants";

export function useUpdateTenant(tenantId: number) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, UpdateTenantRequest>({
    mutationFn: (body) => updateTenant(tenantId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenant-summary", tenantId] });
    },
  });
}
