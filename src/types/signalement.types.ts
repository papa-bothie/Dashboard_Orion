// ============================================================
// ORION — Types : Signalement
// Interfaces pour le formulaire citoyen
// ============================================================

export type SignalementType = "security" | "medical" | "technical" | "other";
export type SignalementUrgency = "urgent" | "medium";

export interface SignalementFormData {
    type: SignalementType;
    urgency: SignalementUrgency;
    location: string;
    description: string;
    /** Coordonnées GPS si disponibles */
    lat?: number;
    lng?: number;
    /** Photo jointe (base64 ou File) */
    photo?: File | string;
}

export interface SignalementResponse {
    id: string;
    trackingNumber: string; // Ex: "ORION-123456"
    createdAt: string;
    message: string;
}
