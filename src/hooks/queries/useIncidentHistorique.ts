import { useQuery } from "@tanstack/react-query";
import { incidentsService } from "@/services/api/incidents.service";

export const INCIDENT_HISTORIQUE_QUERY_KEY = ["incidentHistorique"];

export function useIncidentHistorique(id: string) {
  return useQuery({
    queryKey: [...INCIDENT_HISTORIQUE_QUERY_KEY, id],
    queryFn: () => incidentsService.getIncidentHistorique(id),
    enabled: !!id,
  });
}
