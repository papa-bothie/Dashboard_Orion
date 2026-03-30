// ============================================================
// ORION — Composant : EmptyState
// Placeholder affiché quand une liste est vide
// ============================================================

import type { ReactNode } from "react";

interface EmptyStateProps {
    message?: string;
    description?: string;
    icon?: ReactNode;
}

export default function EmptyState({
    message = "Aucune donnée disponible",
    description,
    icon,
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center h-32 gap-2 text-muted-foreground">
            {icon && <div className="opacity-50">{icon}</div>}
            <p className="text-sm font-medium">{message}</p>
            {description && (
                <p className="text-xs text-center max-w-[200px]">{description}</p>
            )}
        </div>
    );
}
