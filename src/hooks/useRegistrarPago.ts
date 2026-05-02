import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  registrarPago,
  type RegistrarPagoRequest,
  type RegistrarPagoResponse,
} from "../service/propiedades";
import type { ApiResponse } from "../service/client";

export function useRegistrarPago(idPropiedad: string) {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<RegistrarPagoResponse>,
    Error,
    RegistrarPagoRequest
  >({
    mutationFn: (body) => registrarPago(idPropiedad, body),
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
