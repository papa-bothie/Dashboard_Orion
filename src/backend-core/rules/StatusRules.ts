import { StatutSignalement } from '../enums';

export class StatusException extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'StatusException';
    }
}

export const StatusRules = {
    getStatutInitial(): StatutSignalement {
        return StatutSignalement.EN_ATTENTE;
    },

    validerTransition(statutActuel: StatutSignalement, nouveauStatut: StatutSignalement): void {
        const transitionsValides: Record<StatutSignalement, StatutSignalement[]> = {
            [StatutSignalement.EN_ATTENTE]: [StatutSignalement.ASSIGNE, StatutSignalement.REJETE],
            [StatutSignalement.ASSIGNE]: [StatutSignalement.EN_COURS, StatutSignalement.EN_ATTENTE],
            [StatutSignalement.EN_COURS]: [StatutSignalement.RESOLU, StatutSignalement.ASSIGNE],
            [StatutSignalement.RESOLU]: [],  // État terminal
            [StatutSignalement.REJETE]: []   // État terminal
        };

        const possibilites = transitionsValides[statutActuel];
        if (!possibilites || !possibilites.includes(nouveauStatut)) {
            throw new StatusException(`Transition invalide : impossible de passer de ${statutActuel} vers ${nouveauStatut}.`);
        }
    }
};
