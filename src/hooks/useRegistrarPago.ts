import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  registerPayment,
  type RegisterPaymentRequest,
  type RegisterPaymentResponse,
} from "../service/propiedades";
import type { ApiResponse } from "../service/client";

export function useRegistrarPago(idPropiedad: string) {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<RegisterPaymentResponse>,
    Error,
    RegisterPaymentRequest
  >({
    mutationFn: (body: RegisterPaymentRequest) =>
      registerPayment(idPropiedad, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["propiedad-detalle", idPropiedad],
      });
      queryClient.invalidateQueries({ queryKey: ["facturas", idPropiedad] });
      queryClient.invalidateQueries({ queryKey: ["pagos", idPropiedad] });
      queryClient.invalidateQueries({ queryKey: ["propiedades"] });
    },
  });
}
