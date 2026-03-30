// ============================================================
// ORION — Hook Métier : useAgentsLogic
// Logique de préparation des données agents (sans UI)
// ============================================================

import { useMemo } from "react";
import type { Agent } from "@/types/agent.types";

/**
 * Encapsule toute la logique de traitement des agents.
 * S'utilise entre le hook de données (useAgents) et les composants UI.
 *
 * @example
 * const { data: agents = [] } = useAgents();
 * const { availableAgents, nearbyAgents } = useAgentsLogic(agents);
 */
export function useAgentsLogic(agents: Agent[]) {
    /** Agents actuellement disponibles (status === "available") */
    const availableAgents = useMemo(
        () => agents.filter((a) => a.status === "available"),
        [agents]
    );

    /** Agents en intervention (status === "busy") */
    const busyAgents = useMemo(
        () => agents.filter((a) => a.status === "busy"),
        [agents]
    );

    /** Agents hors ligne (status === "offline") */
    const offlineAgents = useMemo(
        () => agents.filter((a) => a.status === "offline"),
        [agents]
    );

    /**
     * Agents à afficher dans le panneau latéral (3 premiers disponibles).
     * TODO: Trier par proximité GPS quand la position de l'opérateur est connue.
     */
    const nearbyAgents = useMemo(() => agents.slice(0, 3), [agents]);

    /** Map pour accès rapide par ID */
    const agentById = useMemo(
        () => new Map(agents.map((a) => [a.id, a])),
        [agents]
    );

    /** Statistiques rapides */
    const stats = useMemo(
        () => ({
            total: agents.length,
            available: availableAgents.length,
            busy: busyAgents.length,
            offline: offlineAgents.length,
        }),
        [agents, availableAgents, busyAgents, offlineAgents]
    );

    return {
        availableAgents,
        busyAgents,
        offlineAgents,
        nearbyAgents,
        agentById,
        stats,
    };
}
