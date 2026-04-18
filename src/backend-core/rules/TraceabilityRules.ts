import { HistoriqueEvenement, Signalement } from '../models';
import { TypeEvenementHistorique } from '../enums';
import { IdGenerator } from '../utils/IdGenerator';

export const TraceabilityRules = {
    ajouterEvenement(
        signalement: Signalement,
        type: TypeEvenementHistorique,
        description: string,
        donneesRestantes?: any
    ): void {
        if (!signalement.historique) {
            signalement.historique = [];
        }

        const evenement: HistoriqueEvenement = {
            id: IdGenerator.genererIdHistorique(),
            type,
            date: new Date(),
            description,
            donnees: donneesRestantes
        };

        signalement.historique.push(evenement);
    }
};
