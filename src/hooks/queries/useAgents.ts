// ============================================================
// ORION — Hook React Query : useAgents
// Récupère et met en cache la liste des agents
// ============================================================

import { useQuery } from "@tanstack/react-query";
import { agentsService } from "@/services/api/agents.service";
import type { Agent } from "@/types/agent.types";

export const AGENTS_QUERY_KEY = ["agents"] as const;

/**
 * Hook pour récupérer tous les agents depuis le backend.
 *
 * @example
 * const { data: agents, isLoading, error } = useAgents();
 */
export function useAgents() {
    return useQuery({
        queryKey: AGENTS_QUERY_KEY,
        queryFn: async (): Promise<Agent[]> => {
            const response = await agentsService.getAll();
            return response.data;
        },
    });
}
