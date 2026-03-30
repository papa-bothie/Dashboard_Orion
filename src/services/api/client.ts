// ============================================================
// ORION — Service API : Client HTTP
// Client fetch centralisé avec gestion des erreurs
// ============================================================

import { ENV } from "@/config/env";

const BASE_URL = `${ENV.API_URL}/api`;

/**
 * Fonction de requête générique.
 * Toutes les requêtes API ORION passent par ici.
 *
 * @example
 * const agents = await request<Agent[]>("/agents");
 */
async function request<T>(
    endpoint: string,
    options?: RequestInit
): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;

    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            // TODO: Ajouter l'authentification JWT quand le backend sera prêt
            // Authorization: `Bearer ${getToken()}`,
            ...options?.headers,
        },
        ...options,
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(
            errorBody?.message ?? `Erreur HTTP ${response.status} — ${endpoint}`
        );
    }

    return response.json() as Promise<T>;
}

/**
 * Client API ORION — Méthodes HTTP principales
 */
export const apiClient = {
    get: <T>(endpoint: string): Promise<T> => request<T>(endpoint),

    post: <T>(endpoint: string, body: unknown): Promise<T> =>
        request<T>(endpoint, {
            method: "POST",
            body: JSON.stringify(body),
        }),

    patch: <T>(endpoint: string, body: unknown): Promise<T> =>
        request<T>(endpoint, {
            method: "PATCH",
            body: JSON.stringify(body),
        }),

    put: <T>(endpoint: string, body: unknown): Promise<T> =>
        request<T>(endpoint, {
            method: "PUT",
            body: JSON.stringify(body),
        }),

    delete: <T>(endpoint: string): Promise<T> =>
        request<T>(endpoint, { method: "DELETE" }),
};
