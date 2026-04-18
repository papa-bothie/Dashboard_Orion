import { Signalement } from '../models';
import { IdGenerator } from '../utils/IdGenerator';
import { PrioritizationRules } from './PrioritizationRules';
import { StatusRules } from './StatusRules';

export const EnrichmentRules = {
    enrichirNouveauSignalement(signalement: Signalement): Signalement {
        signalement.id = IdGenerator.genererIdSignalement();
        signalement.dateCreation = new Date();
        signalement.statut = StatusRules.getStatutInitial();

        // Calcul de la priorité basé sur d'autres règles
        signalement.priorite = PrioritizationRules.calculerPriorite(signalement);

        // Initialisation
        signalement.agentAssigneId = null;
        signalement.historique = [];

        return signalement;
    }
};
