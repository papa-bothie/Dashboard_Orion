import { useQuery } from "@tanstack/react-query";
import { agentsService } from "@/services/api/agents.service";
import type { Agent } from "@/types/agent.types";

export const AGENTS_DISPONIBLES_QUERY_KEY = ["agentsDisponibles"];

export function useAgentsDisponibles() {
  return useQuery({
    queryKey: AGENTS_DISPONIBLES_QUERY_KEY,
    queryFn: () => agentsService.getAgentsDisponibles(),
    refetchInterval: 15000,
  });
}
