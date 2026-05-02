import { useQuery } from "@tanstack/react-query";
import { getPagosPropiedad } from "../service/propiedades";
import type { ApiResponse } from "../service/client";
import type { PagoHistorial } from "../service/propiedades";

export function usePagos(idPropiedad: string) {
  return useQuery<ApiResponse<PagoHistorial[]>>({
    queryKey: ["pagos", idPropiedad],
    queryFn: () => getPagosPropiedad(idPropiedad),
    enabled: !!idPropiedad,
  });
}
