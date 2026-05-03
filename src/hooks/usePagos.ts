import { useQuery } from "@tanstack/react-query";
import { getPropertyPayments } from "../service/propiedades";
import type { ApiResponse } from "../service/client";
import type { PaymentRecord } from "../service/propiedades";

export function usePagos(idPropiedad: string) {
  return useQuery<ApiResponse<PaymentRecord[]>>({
    queryKey: ["pagos", idPropiedad],
    queryFn: () => getPropertyPayments(idPropiedad),
    enabled: !!idPropiedad,
  });
}
