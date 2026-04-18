import { Signalement, Agent } from '../models';
import { ValidationRules } from '../rules/ValidationRules';
import { EnrichmentRules } from '../rules/EnrichmentRules';
import { AssignmentRules } from '../rules/AssignmentRules';
import { StatusRules } from '../rules/StatusRules';
import { TraceabilityRules } from '../rules/TraceabilityRules';
import { TypeEvenementHistorique, StatutSignalement, TypeIncident } from '../enums';

export class SignalementService {
    // Actuellement simulé en memoire sans base de données
    private agentsDisponibles: Agent[] = [
        { id: 'A001', nom: 'Alice Sécu', disponible: true, specialites: [TypeIncident.SECURITE] },
        { id: 'A002', nom: 'Bob Médic', disponible: true, specialites: [TypeIncident.MEDICAL] },
        { id: 'A003', nom: 'Charlie Tech', disponible: false, specialites: [TypeIncident.TECHNIQUE] },
        { id: 'A004', nom: 'Diana Poly', disponible: true, specialites: [TypeIncident.SECURITE, TypeIncident.MEDICAL] }
    ];

    /**
     * 10. FLUX COMPLET POUR CREER ET TRAITER UN NOUVEAU SIGNALEMENT
     */
    public traiterSignalement(dataBrute: Partial<Signalement>): Signalement {
        // 1. Validation de la donnée
        ValidationRules.validerSignalementBrut(dataBrute);

        // 2. Clone sécurisé après validation
        let signalement = { ...dataBrute } as Signalement;

        // 3. Enrichissement (ID, Priorité, Dates, etc)
        signalement = EnrichmentRules.enrichirNouveauSignalement(signalement);

        // 4. Traçabilité : Historisation de la création
        TraceabilityRules.ajouterEvenement(
            signalement,
            TypeEvenementHistorique.CREATION,
            'Création initiale du signalement dans le système.'
        );

        // 5. Tentative d'assignation automatique
        this.tenterAssignationAutomatique(signalement);

        return signalement;
    }

    /**
     * Tente de lier le signalement à un agent qualifié disponible
     */
    private tenterAssignationAutomatique(signalement: Signalement): void {
        const agentAssigne = AssignmentRules.trouverAgent(signalement, this.agentsDisponibles);

        if (agentAssigne) {
            // Simulation: L'agent n'est plus disponible après une assignation complète
            agentAssigne.disponible = false;

            signalement.agentAssigneId = agentAssigne.id;

            // Mise à jour du statut
            StatusRules.validerTransition(signalement.statut!, StatutSignalement.ASSIGNE);
            signalement.statut = StatutSignalement.ASSIGNE;

            // Traçabilité des évolutions de cycle de vie
            TraceabilityRules.ajouterEvenement(
                signalement,
                TypeEvenementHistorique.ASSIGNATION,
                `Assignation automatique à l'agent ${agentAssigne.nom} (${agentAssigne.id})`
            );

            TraceabilityRules.ajouterEvenement(
                signalement,
                TypeEvenementHistorique.CHANGEMENT_STATUT,
                `Statut changé de EN_ATTENTE à ASSIGNE.`,
                { precedent: StatutSignalement.EN_ATTENTE, nouveau: StatutSignalement.ASSIGNE }
            );
        }
    }

    /**
     * Fonction manuelle pour qu'un opérateur mette à jour le statut
     */
    public changerStatutSignalement(signalement: Signalement, nouveauStatut: StatutSignalement, raison: string): void {
        // Vérifier si la transition est possible
        StatusRules.validerTransition(signalement.statut!, nouveauStatut);

        const statutPrecedent = signalement.statut;
        signalement.statut = nouveauStatut;

        TraceabilityRules.ajouterEvenement(
            signalement,
            TypeEvenementHistorique.CHANGEMENT_STATUT,
            `Changement manuel de statut : ${raison}`,
            { precedent: statutPrecedent, nouveau: nouveauStatut }
        );
    }
}
