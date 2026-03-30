import { QueryClient } from "@tanstack/react-query";

// ============================================================
// ORION — Configuration : QueryClient React Query
// ============================================================

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            /**
             * staleTime: Les données sont considérées "fraîches" pendant 30s.
             * Évite les refetch inutiles lors de changements d'onglet.
             */
            staleTime: 30_000,
            /**
             * retry: 2 tentatives automatiques en cas d'erreur réseau.
             */
            retry: 2,
            /**
             * refetchOnWindowFocus: Rafraîchit les données quand l'utilisateur
             * revient sur l'onglet (comportement attendu pour un dashboard).
             */
            refetchOnWindowFocus: true,
        },
        mutations: {
            retry: 1,
        },
    },
});
