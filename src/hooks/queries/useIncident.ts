import { useQuery } from "@tanstack/react-query";
import { incidentsService } from "@/services/api/incidents.service";
import type { Incident } from "@/types/incident.types";

export const INCIDENT_DETAIL_QUERY_KEY = ["incident"];

export function useIncident(id: string) {
  return useQuery({
    queryKey: [...INCIDENT_DETAIL_QUERY_KEY, id],
    queryFn: () => incidentsService.getIncidentById(id),
    enabled: !!id,
    refetchInterval: 10000,
  });
}
