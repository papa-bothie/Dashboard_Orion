// ============================================================
// ORION — Types : Agent
// Interfaces TypeScript centralisées pour les agents terrain
// ============================================================

export type AgentStatus = "available" | "busy" | "offline";
export type AgentSkill = "sécurité" | "médical" | "technique";

export interface Agent {
    id: string;
    name: string;
    phone?: string;
    email?: string;
    status: AgentStatus;
    location: string;
    lat: number;
    lng: number;
    skills: AgentSkill[];
    /** Distance calculée côté client (affichage uniquement) */
    distance?: string;
    /** Token Firebase Cloud Messaging (notifications push) */
    fcmToken?: string;
    /** Dernière mise à jour de position — ISO 8601 */
    lastSeen?: string;
}
