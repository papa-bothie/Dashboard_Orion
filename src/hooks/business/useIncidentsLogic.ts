// ============================================================
// ORION — Hook Métier : useIncidentsLogic
// Logique de préparation des données incidents (sans UI)
// ============================================================

import { useMemo } from "react";
import type { Incident } from "@/types/incident.types";

/**
 * Encapsule toute la logique de traitement des incidents.
 *
 * @example
 * const { data: incidents = [] } = useIncidents();
 * const { filteredIncidents, activeCount } = useIncidentsLogic(incidents, searchQuery);
 */
export function useIncidentsLogic(
    incidents: Incident[],
    searchQuery = ""
) {
    /** Incidents filtrés par la recherche texte */
    const filteredIncidents = useMemo(() => {
        if (!searchQuery.trim()) return incidents;
        const q = searchQuery.toLowerCase();
        return incidents.filter(
            (i) =>
                i.type.toLowerCase().includes(q) ||
                i.location.toLowerCase().includes(q) ||
                i.description?.toLowerCase().includes(q)
        );
    }, [incidents, searchQuery]);

    /** Incidents en attente d'affectation */
    const pendingIncidents = useMemo(
        () => incidents.filter((i) => i.status === "pending"),
        [incidents]
    );

    /** Incidents assignés mais pas encore résolus */
    const activeIncidents = useMemo(
        () =>
            incidents.filter(
                (i) => i.status === "assigned" || i.status === "in_progress"
            ),
        [incidents]
    );

    /** Incidents urgents (toutes urgences confondues) */
    const urgentIncidents = useMemo(
        () => incidents.filter((i) => i.urgency === "urgent"),
        [incidents]
    );

    /** Nombre total d'incidents "non clôturés" (pour le StatsCard) */
    const activeCount = useMemo(
        () =>
            incidents.filter(
                (i) => i.status !== "resolved" && i.status !== "closed"
            ).length,
        [incidents]
    );

    /** Statistiques rapides */
    const stats = useMemo(
        () => ({
            total: incidents.length,
            pending: pendingIncidents.length,
            active: activeIncidents.length,
            urgent: urgentIncidents.length,
            resolved: incidents.filter((i) => i.status === "resolved").length,
        }),
        [incidents, pendingIncidents, activeIncidents, urgentIncidents]
    );

    return {
        filteredIncidents,
        pendingIncidents,
        activeIncidents,
        urgentIncidents,
        activeCount,
        stats,
    };
}
