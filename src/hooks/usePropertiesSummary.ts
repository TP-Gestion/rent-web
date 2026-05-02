import { useQuery } from "@tanstack/react-query";
import { getPropertiesSummary } from "../service/propiedades";

export function usePropertiesSummary() {
  return useQuery({
    queryKey: ["propertiesSummary"],
    queryFn: getPropertiesSummary,
  });
}
