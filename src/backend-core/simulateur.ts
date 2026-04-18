import { SignalementService } from './services/SignalementService';
import { TypeIncident, NiveauUrgence, StatutSignalement } from './enums';
import { ValidationException } from './rules/ValidationRules';
import { StatusException } from './rules/StatusRules';

function lancerSimulation() {
    const service = new SignalementService();

    console.log('--- TEST 1 : SIGNALEMENT VALIDE ---');
    try {
        const signalementValide = service.traiterSignalement({
            type: TypeIncident.MEDICAL,
            urgence: NiveauUrgence.URGENT,
            localisation: { latitude: 45.764, longitude: 4.835 },
            description: 'Je vois un blessé grave allongé au sol qui perd beaucoup de sang.'
        });
        console.log(JSON.stringify(signalementValide, null, 2));

        // Test changement statut
        console.log('\n--- TEST 2 : CHANGEMENT DE STATUT ---');
        service.changerStatutSignalement(signalementValide, StatutSignalement.EN_COURS, 'L\'agent vient d\'arriver sur place.');
        console.log(`Nouveau statut : ${signalementValide.statut}`);
    } catch (err: any) {
        console.error('Erreur inattendue:', err.message);
    }

    console.log('\n--- TEST 3 : SIGNALEMENT INVALIDE (Pas de description) ---');
    try {
        const signalementInvalide = service.traiterSignalement({
            type: TypeIncident.TECHNIQUE,
            urgence: NiveauUrgence.NON_URGENT,
            localisation: { latitude: 45.764, longitude: 4.835 },
            description: ''
        });
    } catch (err: any) {
        if (err instanceof ValidationException) {
            console.log('Exception métier gérée :', err.message);
        }
    }

    console.log('\n--- TEST 4 : TRANSITION STATUT INVALIDE ---');
    try {
        // Essayer de le mettre RESOLU directement sans passer par l'état intermédiaire
        service.changerStatutSignalement(
            { statut: StatutSignalement.EN_ATTENTE } as any,
            StatutSignalement.RESOLU,
            'On résout direct!'
        );
    } catch (err: any) {
        if (err instanceof StatusException) {
            console.log('Exception statut bloquée ! :', err.message);
        }
    }
}

lancerSimulation();
