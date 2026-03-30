// ============================================================
// ORION — Service API : Agents
// Couche d'accès aux données agents du backend
// ============================================================

import { apiClient } from "./client";
import type { Agent } from "@/types/agent.types";
import type { ApiResponse } from "@/types/api.types";

export const agentsService = {
    /**
     * Récupère la liste complète des agents.
     * GET /api/agents
     */
    getAll: (): Promise<ApiResponse<Agent[]>> =>
        apiClient.get<ApiResponse<Agent[]>>("/agents"),

    /**
     * Récupère un agent par son identifiant.
     * GET /api/agents/:id
     */
    getById: (id: string): Promise<ApiResponse<Agent>> =>
        apiClient.get<ApiResponse<Agent>>(`/agents/${id}`),

    /**
     * Met à jour le statut d'un agent.
     * PATCH /api/agents/:id/status
     */
    updateStatus: (
        id: string,
        status: Agent["status"]
    ): Promise<ApiResponse<Agent>> =>
        apiClient.patch<ApiResponse<Agent>>(`/agents/${id}/status`, { status }),

    /**
     * Met à jour la position GPS d'un agent.
     * PATCH /api/agents/:id/position
     */
    updatePosition: (
        id: string,
        lat: number,
        lng: number
    ): Promise<ApiResponse<Agent>> =>
        apiClient.patch<ApiResponse<Agent>>(`/agents/${id}/position`, { lat, lng }),
};
