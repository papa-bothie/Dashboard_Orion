// ============================================================
// ORION — Hook React Query : useIncidents
// Récupère et met en cache la liste des incidents
// ============================================================

import { useQuery } from "@tanstack/react-query";
import { incidentsService } from "@/services/api/incidents.service";
import type { Incident } from "@/types/incident.types";

export const INCIDENTS_QUERY_KEY = ["incidents"] as const;

/**
 * Hook pour récupérer tous les incidents depuis le backend.
 *
 * @example
 * const { data: incidents, isLoading, error } = useIncidents();
 */
export function useIncidents() {
    return useQuery({
        queryKey: INCIDENTS_QUERY_KEY,
        queryFn: async (): Promise<Incident[]> => {
            const response = await incidentsService.getAll();
            return response.data;
        },
    });
}
