// ============================================================
// ORION — Service API : Agents
// ============================================================

import { apiClient } from "./axios.config";
import type { Agent, AgentStatus, AgentSkill } from "@/types/agent.types";

/**
 * Extrait un tableau depuis la réponse API ORION.
 */
function extractArray(data: any): any[] {
  const payload = data?.data || data;
  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === "object") {
    const firstArray = Object.values(payload).find(Array.isArray);
    if (firstArray) return firstArray as any[];
  }
  return [];
}

/**
 * Mappe un agent du backend vers le format du frontend.
 */
function mapAgent(backendAgent: any): Agent {
  // Mapping du statut
  const statusMap: Record<string, AgentStatus> = {
    DISPONIBLE: "available",
    EN_INTERVENTION: "busy",
    INACTIF: "offline",
  };

  const name = [backendAgent.prenom, backendAgent.nom].filter(Boolean).join(" ") || "Agent Inconnu";
  const mappedStatus = statusMap[backendAgent.statut] || "offline";

  return {
    id: backendAgent.id,
    name,
    status: mappedStatus as AgentStatus,
    location: "Sur zone", // Valeur par défaut
    lat: backendAgent.latitude || 14.6928,
    lng: backendAgent.longitude || -17.4467,
    skills: ["sécurité"] as AgentSkill[], // Valeur par défaut
    phone: backendAgent.telephone,
    email: backendAgent.email,
  };
}

export const agentsService = {
  getAgentsDisponibles: async (): Promise<Agent[]> => {
    const data = await apiClient.get<any, any>("/agents/disponibles");
    const rawAgents = extractArray(data);
    return rawAgents.map(mapAgent);
  },

  getAll: async (): Promise<Agent[]> => {
    const data = await apiClient.get<any, any>("/agents");
    const rawAgents = extractArray(data);
    return rawAgents.map(mapAgent);
  },
};
