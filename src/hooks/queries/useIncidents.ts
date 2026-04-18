import { useQuery } from "@tanstack/react-query";
import { incidentsService } from "@/services/api/incidents.service";
import type { Incident } from "@/types/incident.types";

export const INCIDENTS_QUERY_KEY = ["incidents"];

export function useIncidents(filters?: Record<string, any>) {
  return useQuery({
    queryKey: [...INCIDENTS_QUERY_KEY, filters],
    queryFn: () => incidentsService.getIncidents(filters),
    // Polling automatique toutes les 10 secondes pour le temps réel
    refetchInterval: 10000, 
  });
}
