export enum TypeIncident {
    SECURITE = 'SECURITE',
    MEDICAL = 'MEDICAL',
    TECHNIQUE = 'TECHNIQUE',
    AUTRE = 'AUTRE'
}

export enum NiveauUrgence {
    URGENT = 'URGENT',
    NON_URGENT = 'NON_URGENT'
}

export enum StatutSignalement {
    EN_ATTENTE = 'EN_ATTENTE',
    ASSIGNE = 'ASSIGNE',
    EN_COURS = 'EN_COURS',
    RESOLU = 'RESOLU',
    REJETE = 'REJETE'
}

export enum Priorite {
    CRITIQUE = 'CRITIQUE',
    ELEVEE = 'ELEVEE',
    NORMALE = 'NORMALE',
    BASSE = 'BASSE'
}

export enum TypeEvenementHistorique {
    CREATION = 'CREATION',
    CHANGEMENT_STATUT = 'CHANGEMENT_STATUT',
    ASSIGNATION = 'ASSIGNATION',
    ENRICHISSEMENT = 'ENRICHISSEMENT',
    NOTE_AJOUTEE = 'NOTE_AJOUTEE'
}
