import { useQuery } from "@tanstack/react-query";
import { getDetallePropiedad } from "../service/propiedades";

export function usePropertyDetail(idPropiedad: string) {
  return useQuery({
    queryKey: ["propiedad-detalle", idPropiedad],
    queryFn: () => getDetallePropiedad(idPropiedad),
    enabled: !!idPropiedad,
  });
}
