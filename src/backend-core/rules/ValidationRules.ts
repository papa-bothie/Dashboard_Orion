import { Signalement } from '../models';
import { TypeIncident, NiveauUrgence } from '../enums';

export class ValidationException extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ValidationException';
    }
}

export const ValidationRules = {
    validerSignalementBrut(data: Partial<Signalement>): void {
        if (!data.type || !Object.values(TypeIncident).includes(data.type)) {
            throw new ValidationException('Type d\'incident invalide ou manquant.');
        }

        if (!data.urgence || !Object.values(NiveauUrgence).includes(data.urgence)) {
            throw new ValidationException('Niveau d\'urgence invalide ou manquant.');
        }

        if (
            !data.localisation ||
            typeof data.localisation.latitude !== 'number' ||
            typeof data.localisation.longitude !== 'number'
        ) {
            throw new ValidationException('Localisation invalide ou manquante.');
        }

        if (!data.description || data.description.trim().length === 0) {
            throw new ValidationException('La description est obligatoire et ne peut être vide.');
        }
    }
};
