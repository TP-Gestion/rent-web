import { useQuery } from "@tanstack/react-query";
import { getFacturasPropiedad } from "../service/propiedades";
import type { ApiResponse } from "../service/client";
import type { Factura } from "../service/propiedades";

export function useFacturas(idPropiedad: string) {
  return useQuery<ApiResponse<Factura[]>>({
    queryKey: ["facturas", idPropiedad],
    queryFn: () => getFacturasPropiedad(idPropiedad),
    enabled: !!idPropiedad,
  });
}
