// ============================================================
// ORION — Hook Mutation : useAssignAgent
// Affecte manuellement un agent à un incident
// ============================================================

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { incidentsService } from "@/services/api/incidents.service";
import { INCIDENTS_QUERY_KEY } from "@/hooks/queries/useIncidents";
import { toast } from "sonner";

interface AssignAgentPayload {
    incidentId: string;
    agentId: string;
}

/**
 * Hook pour affecter manuellement un agent à un incident.
 * Invalide le cache incidents après succès.
 *
 * @example
 * const { mutate: assignAgent, isPending } = useAssignAgent();
 * assignAgent({ incidentId: "123", agentId: "456" });
 */
export function useAssignAgent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ incidentId, agentId }: AssignAgentPayload) =>
            incidentsService.assign(incidentId, agentId),

        onSuccess: () => {
            // Invalider le cache pour forcer un refetch des incidents
            queryClient.invalidateQueries({ queryKey: INCIDENTS_QUERY_KEY });
            toast.success("Agent assigné avec succès", {
                description: "L'agent a été notifié de cette intervention.",
            });
        },

        onError: (error: Error) => {
            toast.error("Erreur lors de l'affectation", {
                description: error.message,
            });
        },
    });
}
