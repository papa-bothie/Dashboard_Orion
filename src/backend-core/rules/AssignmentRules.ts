import { Signalement, Agent } from '../models';
import { Priorite } from '../enums';

export const AssignmentRules = {
    trouverAgent(signalement: Signalement, agentsDisponibles: Agent[]): Agent | null {
        // D'abord, on filtre uniquement les agents qui sont factuellement disponibles
        const agentsLibres = agentsDisponibles.filter(agent => agent.disponible);

        if (agentsLibres.length === 0) {
            return null;
        }

        // On cherche un spécialiste pour ce type d'incident
        const agentsSpecialises = agentsLibres.filter(agent =>
            agent.specialites.includes(signalement.type)
        );

        if (agentsSpecialises.length > 0) {
            // Dans une appli réelle, on choisirait le plus proche (via la localisation)
            // Ici, on retourne simplement le premier agent qualifié trouvé
            return agentsSpecialises[0];
        }

        // En cas d'incident critique, un agent non spécialisé peut être envoyé si aucun spécialiste dispo
        if (signalement.priorite === Priorite.CRITIQUE || signalement.priorite === Priorite.ELEVEE) {
            return agentsLibres[0];
        }

        return null;
    }
};
