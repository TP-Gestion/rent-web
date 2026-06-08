import { useMutation, useQueryClient } from "@tanstack/react-query";
import { assignTenantToProperty } from "../service/propiedades";
import type { ApiResponse } from "../service/client";

export function useAssignTenant(propertyId: string) {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<void>, Error, number>({
    mutationFn: (tenantId: number) =>
      assignTenantToProperty(Number(propertyId), tenantId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["propiedad-detalle", propertyId],
      });
      queryClient.invalidateQueries({ queryKey: ["propiedades"] });
      queryClient.invalidateQueries({ queryKey: ["propertiesSummary"] });
    },
  });
}
