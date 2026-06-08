import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeTenantFromProperty } from "../service/propiedades";
import type { ApiResponse } from "../service/client";

export function useRemoveTenant(propertyId: string) {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<void>, Error, void>({
    mutationFn: () => removeTenantFromProperty(propertyId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["propiedad-detalle", propertyId],
      });
      queryClient.invalidateQueries({ queryKey: ["propiedades"] });
      queryClient.invalidateQueries({ queryKey: ["propertiesSummary"] });
    },
  });
}
