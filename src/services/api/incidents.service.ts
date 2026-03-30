// ============================================================
// ORION — Service API : Incidents
// Couche d'accès aux données incidents du backend
// ============================================================

import { apiClient } from "./client";
import type { Incident, CreateIncidentPayload } from "@/types/incident.types";
import type { ApiResponse } from "@/types/api.types";

export const incidentsService = {
    /**
     * Récupère tous les incidents.
     * GET /api/incidents
     */
    getAll: (): Promise<ApiResponse<Incident[]>> =>
        apiClient.get<ApiResponse<Incident[]>>("/incidents"),

    /**
     * Récupère un incident par son identifiant.
     * GET /api/incidents/:id
     */
    getById: (id: string): Promise<ApiResponse<Incident>> =>
        apiClient.get<ApiResponse<Incident>>(`/incidents/${id}`),

    /**
     * Crée un nouvel incident (depuis l'opérateur ou le formulaire citoyen).
     * POST /api/incidents
     */
    create: (data: CreateIncidentPayload): Promise<ApiResponse<Incident>> =>
        apiClient.post<ApiResponse<Incident>>("/incidents", data),

    /**
     * Affecte manuellement un agent à un incident.
     * PATCH /api/incidents/:id/assign
     */
    assign: (
        incidentId: string,
        agentId: string
    ): Promise<ApiResponse<Incident>> =>
        apiClient.patch<ApiResponse<Incident>>(`/incidents/${incidentId}/assign`, {
            agentId,
        }),

    /**
     * Met à jour le statut d'un incident.
     * PATCH /api/incidents/:id/status
     */
    updateStatus: (
        id: string,
        status: Incident["status"]
    ): Promise<ApiResponse<Incident>> =>
        apiClient.patch<ApiResponse<Incident>>(`/incidents/${id}/status`, {
            status,
        }),
};
