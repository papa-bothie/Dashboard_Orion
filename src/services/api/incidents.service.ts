// ============================================================
// ORION — Service API : Incidents
// ============================================================

import { apiClient } from "./axios.config";
import type { Incident, IncidentStatus, IncidentUrgency, AssignedBy, IncidentSource } from "@/types/incident.types";

export interface DashboardStatistics {
  byStatus: Record<string, number>;
  byType: Record<string, number>;
  byPriority: Record<string, number>;
}

export interface IncidentHistory {
  id: string;
  action: string;
  date: string;
  utilisateur: string;
  incidentId: string;
}

/**
 * Calcul du temps écoulé depuis la date de création.
 */
function getRelativeTime(dateString: string): string {
  if (!dateString) return "À l'instant";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return "À l'instant";
  if (diffMins < 60) return `Il y a ${diffMins} min`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `Il y a ${diffHours} h`;
  const diffDays = Math.floor(diffHours / 24);
  return `Il y a ${diffDays} j`;
}

/**
 * Mappe un incident du backend vers le format du frontend.
 */
export function mapIncident(backendInc: any): Incident {
  // Mapping statut
  const statusMap: Record<string, IncidentStatus> = {
    EN_ATTENTE: "pending",
    ASSIGNE: "assigned",
    EN_COURS: "in_progress",
    RESOLU: "resolved",
    CLOTURE: "closed",
  };

  // Mapping urgence
  const urgencyMap: Record<string, IncidentUrgency> = {
    CRITIQUE: "urgent", // Au cas où
    HAUTE: "urgent",
    MOYENNE: "medium",
    FAIBLE: "low",
  };

  let assignedAgentName = undefined;
  if (backendInc.agentAssigne) {
    assignedAgentName = [backendInc.agentAssigne.prenom, backendInc.agentAssigne.nom].filter(Boolean).join(" ");
  }

  return {
    id: backendInc.id,
    type: backendInc.type || "Inconnu",
    description: backendInc.description,
    location: backendInc.adresse || "Lieu inconnu",
    lat: backendInc.latitude || 14.6928,
    lng: backendInc.longitude || -17.4467,
    urgency: urgencyMap[backendInc.urgence] || "medium",
    status: statusMap[backendInc.statut] || "pending",
    source: (backendInc.source?.toLowerCase() || "citizen") as IncidentSource,
    cameraId: backendInc.cameraId,
    assignedAgent: assignedAgentName,
    assignedAgentId: backendInc.agentAssigneId,
    assignedBy: "manual",
    time: getRelativeTime(backendInc.dateCreation),
    createdAt: backendInc.dateCreation,
    updatedAt: backendInc.updatedAt,
  };
}

export const incidentsService = {
  getIncidents: async (filters?: Record<string, any>): Promise<Incident[]> => {
    // Transformer les filtres frontend en query params backend
    const apiFilters: Record<string, string> = { ...filters };
    
    if (filters?.status) {
      const reverseStatusMap: Record<string, string> = {
        pending: "EN_ATTENTE",
        assigned: "ASSIGNE",
        in_progress: "EN_COURS",
        resolved: "RESOLU",
        closed: "CLOTURE"
      };
      apiFilters.statut = reverseStatusMap[filters.status] || filters.status;
      delete apiFilters.status;
    }

    if (filters?.urgency) {
      const reverseUrgencyMap: Record<string, string> = {
        urgent: "HAUTE",
        medium: "MOYENNE",
        low: "FAIBLE"
      };
      apiFilters.urgence = reverseUrgencyMap[filters.urgency] || filters.urgency;
      delete apiFilters.urgency;
    }

    const data = await apiClient.get<any, any>("/incidents", { params: apiFilters });
    const payload = data.data || data;
    
    let rawIncidents: any[] = [];
    if (payload && Array.isArray(payload.incidents)) {
      rawIncidents = payload.incidents;
    } else if (Array.isArray(payload)) {
      rawIncidents = payload;
    }
    
    return rawIncidents.map(mapIncident);
  },

  getIncidentById: async (id: string): Promise<Incident> => {
    const data = await apiClient.get<any, any>(`/incidents/${id}`);
    const payload = data.data || data;
    return mapIncident(payload);
  },

  getIncidentHistorique: async (id: string): Promise<IncidentHistory[]> => {
    const data = await apiClient.get<any, any>(`/incidents/${id}/historique`);
    return data.data || data;
  },

  getStatistics: async (): Promise<DashboardStatistics> => {
    const data = await apiClient.get<any, any>("/incidents/statistics");
    const payload = data.data || data;

    // Backend renvoie :
    // { total: number, parStatut: [{ statut: 'EN_ATTENTE', count: '2' }], parType: [...], parPriorite: [...] }
    
    const byStatus: Record<string, number> = {};
    if (Array.isArray(payload.parStatut)) {
      payload.parStatut.forEach((item: any) => {
        const mappedStatus = mapIncident({ statut: item.statut }).status; // utilise le mapper pour uniformiser
        byStatus[mappedStatus] = (byStatus[mappedStatus] || 0) + parseInt(item.count, 10);
      });
    }

    const byType: Record<string, number> = {};
    if (Array.isArray(payload.parType)) {
      payload.parType.forEach((item: any) => {
        byType[item.type] = parseInt(item.count, 10);
      });
    }

    const byPriority: Record<string, number> = {};
    if (Array.isArray(payload.parPriorite)) {
      payload.parPriorite.forEach((item: any) => {
        byPriority[item.priorite?.toLowerCase()] = parseInt(item.count, 10);
      });
    }

    return {
      byStatus,
      byType,
      byPriority,
    };
  },

  assignIncident: async (id: string, payload: { agentAssigneId: string | null; statut: string }): Promise<Incident> => {
    const data = await apiClient.put<any, any>(`/incidents/${id}`, payload);
    return data.data || data;
  },
};
