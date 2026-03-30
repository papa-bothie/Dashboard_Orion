// ============================================================
// ORION — Hook WebSocket : useOrionSocket
// Connexion temps réel et synchronisation du cache React Query
// ============================================================

import { useEffect, useRef, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AGENTS_QUERY_KEY } from "@/hooks/queries/useAgents";
import { INCIDENTS_QUERY_KEY } from "@/hooks/queries/useIncidents";
import { ORION_EVENTS } from "@/services/socket/socket";
import type { Agent } from "@/types/agent.types";
import type { Incident } from "@/types/incident.types";

// ─── PRÉREQUIS ────────────────────────────────────────────────
// Installer socket.io-client avant d'activer ce hook :
//   npm install socket.io-client
// ─────────────────────────────────────────────────────────────

/**
 * Hook de connexion WebSocket ORION.
 *
 * Écoute les événements temps réel et met à jour le cache React Query
 * sans déclencher de refetch HTTP inutile.
 *
 * Architecture :
 *   Backend NestJS WebSocket Gateway
 *     ↓ événements
 *   useOrionSocket (ce hook)
 *     ↓ queryClient.setQueryData()
 *   Composants UI (re-render automatique)
 *
 * Pour activer :
 *   1. `npm install socket.io-client`
 *   2. Décommenter les blocs socket dans ce fichier
 *   3. Configurer VITE_WS_URL dans .env
 */
export function useOrionSocket() {
    const queryClient = useQueryClient();
    const isConnectedRef = useRef(false);

    // ─── Handlers des événements ────────────────────────────────

    const handleNewIncident = useCallback(
        (incident: Incident) => {
            queryClient.setQueryData(
                INCIDENTS_QUERY_KEY,
                (old: Incident[] = []) => [incident, ...old]
            );
        },
        [queryClient]
    );

    const handleIncidentUpdated = useCallback(
        (updated: Incident) => {
            queryClient.setQueryData(
                INCIDENTS_QUERY_KEY,
                (old: Incident[] = []) =>
                    old.map((inc) => (inc.id === updated.id ? updated : inc))
            );
        },
        [queryClient]
    );

    const handleAgentPosition = useCallback(
        ({
            agentId,
            lat,
            lng,
        }: {
            agentId: string;
            lat: number;
            lng: number;
        }) => {
            queryClient.setQueryData(
                AGENTS_QUERY_KEY,
                (old: Agent[] = []) =>
                    old.map((agent) =>
                        agent.id === agentId ? { ...agent, lat, lng } : agent
                    )
            );
        },
        [queryClient]
    );

    const handleAgentUpdate = useCallback(
        (updated: Agent) => {
            queryClient.setQueryData(
                AGENTS_QUERY_KEY,
                (old: Agent[] = []) =>
                    old.map((agent) => (agent.id === updated.id ? updated : agent))
            );
        },
        [queryClient]
    );

    // ─── Connexion WebSocket ──────────────────────────────────────

    useEffect(() => {
        // TODO: Décommenter et activer quand le backend WebSocket est prêt
        //
        // import { ENV } from "@/config/env";
        // import { io } from "socket.io-client";
        //
        // const socket = io(ENV.WS_URL, {
        //   transports: ["websocket"],
        //   reconnectionAttempts: 5,
        //   reconnectionDelay: 2000,
        // });
        //
        // socket.on("connect", () => {
        //   isConnectedRef.current = true;
        //   socket.emit(ORION_EVENTS.DASHBOARD_SUBSCRIBE);
        //   console.log("[ORION Socket] Connecté ✓");
        // });
        //
        // socket.on("disconnect", (reason) => {
        //   isConnectedRef.current = false;
        //   console.warn("[ORION Socket] Déconnecté :", reason);
        // });
        //
        // socket.on(ORION_EVENTS.INCIDENT_NEW, handleNewIncident);
        // socket.on(ORION_EVENTS.INCIDENT_UPDATED, handleIncidentUpdated);
        // socket.on(ORION_EVENTS.INCIDENT_ASSIGNED, handleIncidentUpdated);
        // socket.on(ORION_EVENTS.AGENT_POSITION, handleAgentPosition);
        // socket.on(ORION_EVENTS.AGENT_UPDATE, handleAgentUpdate);
        //
        // return () => {
        //   socket.disconnect();
        //   isConnectedRef.current = false;
        // };
    }, [
        handleNewIncident,
        handleIncidentUpdated,
        handleAgentPosition,
        handleAgentUpdate,
    ]);

    return {
        /** true quand la connexion WebSocket est active */
        isConnected: isConnectedRef.current,
    };
}
