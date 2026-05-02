import { useQuery } from "@tanstack/react-query";
import { getBuildings } from "../service/propiedades";

export function useBuildings() {
  return useQuery({
    queryKey: ["buildings"],
    queryFn: getBuildings,
  });
}
