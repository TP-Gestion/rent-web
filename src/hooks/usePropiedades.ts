import { useQuery } from "@tanstack/react-query";
import { getPropiedades } from "../service/propiedades";

export function usePropiedades() {
  return useQuery({
    queryKey: ["propiedades"],
    queryFn: getPropiedades,
  });
}
