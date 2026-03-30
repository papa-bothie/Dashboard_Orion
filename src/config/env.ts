// ============================================================
// ORION — Configuration : Variables d'environnement
// Centralise et type toutes les variables d'environnement Vite
// ============================================================

/**
 * Configuration centralisée des variables d'environnement.
 *
 * Variables à définir dans le fichier .env (voir .env.example) :
 *   VITE_API_URL   — URL de base du backend REST (ex: http://localhost:3001)
 *   VITE_WS_URL    — URL du serveur WebSocket   (ex: ws://localhost:3001)
 *   VITE_APP_ENV   — Environnement              (development | staging | production)
 */
export const ENV = {
    API_URL: import.meta.env.VITE_API_URL ?? "http://localhost:3001",
    WS_URL: import.meta.env.VITE_WS_URL ?? "ws://localhost:3001",
    APP_ENV: (import.meta.env.VITE_APP_ENV ?? "development") as
        | "development"
        | "staging"
        | "production",
} as const;

export const IS_DEV = ENV.APP_ENV === "development";
export const IS_PROD = ENV.APP_ENV === "production";
