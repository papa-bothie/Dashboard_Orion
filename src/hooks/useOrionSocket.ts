// ============================================================
// ORION — Hook WebSocket : useOrionSocket
// Connexion temps réel et synchronisation du cache React Query
// ============================================================

import { useEffect, useRef, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { io } from "socket.io-client";
import { ENV } from "@/config/env";
import { AGENTS_QUERY_KEY } from "@/hooks/queries/useAgents";
import { INCIDENTS_QUERY_KEY } from "@/hooks/queries/useIncidents";
import { ORION_EVENTS } from "@/services/socket/socket";
import type { Agent } from "@/types/agent.types";
import type { Incident } from "@/types/incident.types";

/**
 * Hook de connexion WebSocket ORION.
 *
 * Écoute les événements temps réel émis par le backend NestJS
 * et met à jour le cache React Query sans déclencher de refetch HTTP.
 *
 * Architecture :
 *   App Mobile → POST /signalements → Backend NestJS
 *     ↓ socket.emit("incident:new", data)
 *   useOrionSocket (ce hook)
 *     ↓ queryClient.setQueryData()
 *   Composants UI (re-render instantané)
 */
export function useOrionSocket() {
    const queryClient = useQueryClient();
    const isConnectedRef = useRef(false);

    // ─── Handlers des événements ────────────────────────────────

    const handleNewIncident = useCallback(
        (backendIncident: any) => {
            console.log("[ORION Socket] Nouvel incident reçu (brut) :", backendIncident);
            import("@/services/api/incidents.service").then(({ mapIncident }) => {
                const incident = mapIncident(backendIncident);
                queryClient.setQueryData(
                    INCIDENTS_QUERY_KEY,
                    (old: Incident[] = []) => [incident, ...old]
                );
                queryClient.invalidateQueries({ queryKey: ["statistics"] });
            });
        },
        [queryClient]
    );

    const handleIncidentUpdated = useCallback(
        (backendIncident: any) => {
            console.log("[ORION Socket] Incident mis à jour (brut) :", backendIncident);
            import("@/services/api/incidents.service").then(({ mapIncident }) => {
                const updated = mapIncident(backendIncident);
                queryClient.setQueryData(
                    INCIDENTS_QUERY_KEY,
                    (old: Incident[] = []) =>
                        old.map((inc) => (inc.id === updated.id ? updated : inc))
                );
                queryClient.invalidateQueries({ queryKey: ["statistics"] });
            });
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
        (backendAgent: any) => {
            console.log("[ORION Socket] Agent mis à jour (brut) :", backendAgent);
            // On devrait exporter mapAgent pour bien faire, mais on se contentera 
            // de l'update basique si besoin, ou on peut juste refetch.
            queryClient.invalidateQueries({ queryKey: AGENTS_QUERY_KEY });
            // TODO: si on avait exporté mapAgent, on ferait le mapAgent ici.
        },
        [queryClient]
    );

    // ─── Connexion WebSocket ──────────────────────────────────────

    useEffect(() => {
        const socket = io(ENV.WS_URL, {
            transports: ["websocket"],
            reconnectionAttempts: 5,
            reconnectionDelay: 2000,
        });

        socket.on("connect", () => {
            isConnectedRef.current = true;
            socket.emit(ORION_EVENTS.DASHBOARD_SUBSCRIBE);
            console.log("[ORION Socket] Connecté ✓ — ID :", socket.id);
        });

        socket.on("disconnect", (reason) => {
            isConnectedRef.current = false;
            console.warn("[ORION Socket] Déconnecté :", reason);
        });

        socket.on("connect_error", (err) => {
            console.error("[ORION Socket] Erreur de connexion :", err.message);
        });

        // ── Écoute des événements incidents (signalements mobiles) ───
        socket.on(ORION_EVENTS.INCIDENT_NEW, handleNewIncident);
        socket.on(ORION_EVENTS.INCIDENT_UPDATED, handleIncidentUpdated);
        socket.on(ORION_EVENTS.INCIDENT_ASSIGNED, handleIncidentUpdated);

        // ── Écoute des événements agents ─────────────────────────────
        socket.on(ORION_EVENTS.AGENT_POSITION, handleAgentPosition);
        socket.on(ORION_EVENTS.AGENT_UPDATE, handleAgentUpdate);

        return () => {
            socket.disconnect();
            isConnectedRef.current = false;
            console.log("[ORION Socket] Déconnexion propre.");
        };
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
