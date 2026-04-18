import { useMutation, useQueryClient } from "@tanstack/react-query";
import { incidentsService } from "@/services/api/incidents.service";
import { INCIDENTS_QUERY_KEY } from "../queries/useIncidents";
import { AGENTS_DISPONIBLES_QUERY_KEY } from "../queries/useAgentsDisponibles";
import { toast } from "../use-toast";

export function useAssignIncident() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { agentAssigneId: string | null; statut: string } }) => {
      return incidentsService.assignIncident(id, payload);
    },
    onSuccess: () => {
      toast({
        title: "Succès",
        description: "L'agent a été assigné à l'incident avec succès.",
      });
      // Refresh incidents and agents
      queryClient.invalidateQueries({ queryKey: INCIDENTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: AGENTS_DISPONIBLES_QUERY_KEY });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur lors de l'assignation",
        description: error.message || "Impossible d'assigner l'agent. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  });
}
