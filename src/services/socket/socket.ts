// ============================================================
// ORION — Service WebSocket
// Définition des événements temps réel
// ============================================================
//
// PRÉREQUIS : Installer socket.io-client quand le backend sera prêt
//   npm install socket.io-client
//   npm install --save-dev @types/socket.io-client
//
// UTILISATION :
//   Décommenter les imports et l'instance socket ci-dessous.
//   Les événements sont écoutés dans useOrionSocket.ts
// ============================================================

// import { io, type Socket } from "socket.io-client";
// import { ENV } from "@/config/env";

/**
 * Noms des événements WebSocket ORION.
 * Doivent correspondre exactement aux événements émis par le backend NestJS.
 */
export const ORION_EVENTS = {
    // ── Événements reçus (serveur → client dashboard) ──────────
    /** Nouvel incident détecté (par caméra, citoyen ou IA) */
    INCIDENT_NEW: "incident:new",
    /** Un incident a été mis à jour */
    INCIDENT_UPDATED: "incident:updated",
    /** Un incident a été assigné à un agent */
    INCIDENT_ASSIGNED: "incident:assigned",
    /** Statut d'un agent mis à jour */
    AGENT_UPDATE: "agent:update",
    /** Position GPS d'un agent mise à jour (toutes les 5s depuis l'app mobile) */
    AGENT_POSITION: "agent:position",
    /** Message d'activité du moteur IA */
    AI_ACTIVITY: "ai:activity",
    /** Statistiques IA mises à jour */
    AI_STATS: "ai:stats",

    // ── Événements émis (client → serveur) ─────────────────────
    /** Le dashboard demande un rafraîchissement complet */
    DASHBOARD_SUBSCRIBE: "dashboard:subscribe",
} as const;

export type OrionEventName =
    (typeof ORION_EVENTS)[keyof typeof ORION_EVENTS];

// Instance socket — à décommenter quand le backend est disponible
// export const orionSocket: Socket = io(ENV.WS_URL, {
//   autoConnect: false,
//   transports: ["websocket"],
//   reconnectionAttempts: 5,
//   reconnectionDelay: 2000,
// });
