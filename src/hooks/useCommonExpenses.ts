import { useQuery } from "@tanstack/react-query";
import { getBuildingCommonExpenses } from "../service/maintenance";

export function useCommonExpenses(buildingId: number | null) {
  return useQuery({
    queryKey: ["commonExpenses", buildingId],
    queryFn: () =>
      buildingId ? getBuildingCommonExpenses(buildingId) : Promise.resolve({ data: [], errors: [] }),
    enabled: !!buildingId,
  });
}
