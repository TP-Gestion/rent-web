import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  generateBillings,
  type GenerateBillingsRequest,
  type GenerateBillingsResponse,
} from "../service/propiedades";
import type { ApiResponse } from "../service/client";

export function useGenerateBillings() {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<GenerateBillingsResponse>,
    Error,
    GenerateBillingsRequest
  >({
    mutationFn: generateBillings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billable-properties"] });
      queryClient.invalidateQueries({ queryKey: ["propiedades"] });
      queryClient.invalidateQueries({ queryKey: ["propiedad-detalle"] });
    },
  });
}
