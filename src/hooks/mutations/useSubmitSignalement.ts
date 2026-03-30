// ============================================================
// ORION — Hook Mutation : useSubmitSignalement
// Soumet un signalement citoyen au backend
// ============================================================

import { useMutation } from "@tanstack/react-query";
import { signalementsService } from "@/services/api/signalements.service";
import type { SignalementFormData, SignalementResponse } from "@/types/signalement.types";
import { toast } from "sonner";

interface UseSubmitSignalementOptions {
    onSuccess?: (response: SignalementResponse) => void;
}

/**
 * Hook pour soumettre un signalement citoyen via l'API.
 *
 * @example
 * const { mutate: submitSignalement, isPending } = useSubmitSignalement({
 *   onSuccess: (res) => setTrackingNumber(res.trackingNumber)
 * });
 */
export function useSubmitSignalement(options?: UseSubmitSignalementOptions) {
    return useMutation({
        mutationFn: (data: SignalementFormData) =>
            signalementsService.submit(data),

        onSuccess: (response) => {
            options?.onSuccess?.(response.data);
            toast.success("Signalement envoyé !", {
                description: `Votre numéro de suivi : ${response.data.trackingNumber}`,
            });
        },

        onError: (error: Error) => {
            toast.error("Erreur lors de l'envoi", {
                description: error.message ?? "Veuillez réessayer.",
            });
        },
    });
}
