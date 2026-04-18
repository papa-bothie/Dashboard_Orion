import { TypeIncident, NiveauUrgence, StatutSignalement, Priorite, TypeEvenementHistorique } from '../enums';

export interface Localisation {
    latitude: number;
    longitude: number;
    adresse?: string;
}

export interface HistoriqueEvenement {
    id: string;
    type: TypeEvenementHistorique;
    date: Date;
    description: string;
    donnees?: any;
}

export interface Agent {
    id: string;
    nom: string;
    disponible: boolean;
    specialites: TypeIncident[];
}

export interface Signalement {
    id?: string; // Défini après l'enrichissement
    type: TypeIncident;
    urgence: NiveauUrgence;
    priorite?: Priorite;
    statut?: StatutSignalement;
    localisation: Localisation;
    description: string;
    photoUrl?: string;
    agentAssigneId?: string | null;
    dateCreation?: Date;
    historique?: HistoriqueEvenement[];
}
