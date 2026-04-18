import { Priorite, NiveauUrgence, TypeIncident } from '../enums';
import { Signalement } from '../models';

export const PrioritizationRules = {
    calculerPriorite(signalement: Signalement): Priorite {
        // Liste de mots-clés pour analyser la description
        const motsClesCritiques = ['arme', 'feu', 'sang', 'inconscient', 'mort', 'explosion', 'agression'];
        const motsClesEleves = ['blessé', 'vol', 'fumée', 'accident', 'panne', 'fuite'];

        const descriptionMin = signalement.description.toLowerCase();

        // 1. Analyse textuelle (les mots-clés forcent une priorité élevée)
        const estCritiqueParMotCle = motsClesCritiques.some(mot => descriptionMin.includes(mot));
        const estEleveParMotCle = motsClesEleves.some(mot => descriptionMin.includes(mot));

        if (estCritiqueParMotCle) return Priorite.CRITIQUE;

        // 2. Priorisation selon l'urgence déclarée et le type
        if (signalement.urgence === NiveauUrgence.URGENT) {
            if (signalement.type === TypeIncident.SECURITE || signalement.type === TypeIncident.MEDICAL) {
                return Priorite.CRITIQUE;
            }
            return Priorite.ELEVEE;
        }

        if (estEleveParMotCle) return Priorite.ELEVEE;

        return Priorite.NORMALE;
    }
};
