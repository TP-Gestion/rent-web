import { useQuery } from "@tanstack/react-query";
import { getPropertyBillings as getPropertyBillings } from "../service/propiedades";
import type { ApiResponse } from "../service/client";
import type { Billing } from "../service/propiedades";

export function useFacturas(idPropiedad: string) {
  return useQuery<ApiResponse<Billing[]>>({
    queryKey: ["facturas", idPropiedad],
    queryFn: () => getPropertyBillings(idPropiedad),
    enabled: !!idPropiedad,
  });
}
