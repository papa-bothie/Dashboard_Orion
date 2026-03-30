// ============================================================
// ORION — Types : Incident
// Interfaces TypeScript centralisées pour les incidents
// ============================================================

export type IncidentUrgency = "urgent" | "medium" | "low";
export type IncidentStatus =
    | "pending"
    | "assigned"
    | "in_progress"
    | "resolved"
    | "closed";
export type IncidentSource = "manual" | "camera" | "citizen" | "ai";
export type AssignedBy = "manual" | "ai";

export interface Incident {
    id: string;
    type: string;
    description?: string;
    location: string;
    lat: number;
    lng: number;
    urgency: IncidentUrgency;
    status: IncidentStatus;
    source?: IncidentSource;
    /** Identifiant de la caméra si source === "camera" */
    cameraId?: string;
    /** Nom de l'agent assigné (pour affichage) */
    assignedAgent?: string;
    /** ID de l'agent assigné (pour les appels API) */
    assignedAgentId?: string;
    assignedBy?: AssignedBy;
    /** Temps relatif pour l'affichage : "Il y a 5 min" */
    time: string;
    /** Timestamp de création — ISO 8601 */
    createdAt?: string;
    /** Timestamp de dernière modification — ISO 8601 */
    updatedAt?: string;
}

export interface CreateIncidentPayload {
    type: string;
    description?: string;
    location: string;
    lat: number;
    lng: number;
    urgency: IncidentUrgency;
    source?: IncidentSource;
}
