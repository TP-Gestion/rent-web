import { useQuery } from "@tanstack/react-query";
import { getTenants } from "../service/propiedades";

export function useTenants() {
  return useQuery({
    queryKey: ["tenants"],
    queryFn: getTenants,
  });
}
