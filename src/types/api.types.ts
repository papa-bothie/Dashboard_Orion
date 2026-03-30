// ============================================================
// ORION — Types : API
// Types génériques pour les réponses de l'API backend
// ============================================================

export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    total: number;
    page: number;
    limit: number;
}

export interface ApiError {
    message: string;
    code?: string;
    statusCode?: number;
}
