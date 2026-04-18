import { useQuery } from "@tanstack/react-query";
import { incidentsService, type DashboardStatistics } from "@/services/api/incidents.service";

export const STATISTICS_QUERY_KEY = ["statistics"];

export function useStatistics() {
  return useQuery({
    queryKey: STATISTICS_QUERY_KEY,
    queryFn: () => incidentsService.getStatistics(),
    refetchInterval: 15000,
  });
}
