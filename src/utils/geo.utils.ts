// ============================================================
// ORION — Utilitaires : Géographie
// Calcul de distance Haversine (extrait de useAIIncidentManager)
// ============================================================

/**
 * Calcule la distance en kilomètres entre deux points GPS
 * en utilisant la formule de Haversine.
 *
 * @param lat1 Latitude du point 1
 * @param lng1 Longitude du point 1
 * @param lat2 Latitude du point 2
 * @param lng2 Longitude du point 2
 * @returns Distance en kilomètres
 */
export function calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
): number {
    const R = 6371; // Rayon de la Terre en km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

/**
 * Formate une distance en km en chaîne lisible.
 * Ex: 1.2 → "1.2 km" | 0.35 → "350 m"
 */
export function formatDistance(km: number): string {
    if (km < 1) return `${Math.round(km * 1000)} m`;
    return `${km.toFixed(1)} km`;
}
