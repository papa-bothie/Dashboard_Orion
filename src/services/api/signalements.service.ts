// ============================================================
// ORION — Service API : Signalements citoyens
// Couche d'accès pour les soumissions de signalements
// ============================================================

import { apiClient } from "./client";
import type { SignalementFormData, SignalementResponse } from "@/types/signalement.types";
import type { ApiResponse } from "@/types/api.types";

export const signalementsService = {
    /**
     * Soumet un nouveau signalement citoyen.
     * POST /api/signalements
     */
    submit: (
        data: SignalementFormData
    ): Promise<ApiResponse<SignalementResponse>> =>
        apiClient.post<ApiResponse<SignalementResponse>>("/signalements", data),
};
