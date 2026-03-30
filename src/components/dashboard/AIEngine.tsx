// ============================================================
// ORION — Composant : AIEngine
// Affichage du statut du moteur IA — REFACTORISÉ
// Plus aucune simulation Math.random() ni setInterval arbitraire
// ============================================================

import { Brain, Zap, Activity, WifiOff } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AIStats {
  avgAssignmentTime: number;
  totalAutoAssignments: number;
  accuracy: number;
}

interface AIEngineProps {
  /** true quand la connexion WebSocket est active (données réelles) */
  isActive: boolean;
  /** Message d'activité courant (reçu via WebSocket ai:activity) */
  currentActivity?: string;
  /** Statistiques IA (reçues via WebSocket ai:stats) */
  stats?: AIStats;
}

const AIEngine = ({ isActive, currentActivity, stats }: AIEngineProps) => {
  return (
    <Card className="bg-gradient-to-br from-primary/5 to-accent/10 border-primary/20 animate-fade-in">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`p-2 bg-primary/10 rounded-lg ${isActive ? "animate-pulse" : ""}`}>
              <Brain className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-sm">🧠 ORION AI Engine</h3>
              <p className="text-xs text-muted-foreground">
                Système d'affectation intelligent
              </p>
            </div>
          </div>

          <Badge variant={isActive ? "success" : "outline"} className="gap-1">
            {isActive ? (
              <>
                <Activity className="h-3 w-3 animate-pulse" />
                IA Active
              </>
            ) : (
              <>
                <WifiOff className="h-3 w-3" />
                En attente du backend
              </>
            )}
          </Badge>
        </div>

        {/* Message d'activité — uniquement si connexion WebSocket active */}
        {isActive && currentActivity && (
          <div className="bg-card/50 rounded-lg p-3 mb-3 border border-primary/10">
            <div className="flex items-center gap-2 text-sm">
              <Zap className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-foreground font-medium">{currentActivity}</span>
            </div>
          </div>
        )}

        {/* Statistiques — uniquement si données reçues du backend */}
        {isActive && stats ? (
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-card/30 rounded-lg p-2 text-center">
              <p className="text-lg font-bold text-primary">{stats.avgAssignmentTime}s</p>
              <p className="text-[10px] text-muted-foreground">Temps moyen</p>
            </div>
            <div className="bg-card/30 rounded-lg p-2 text-center">
              <p className="text-lg font-bold text-success">{stats.totalAutoAssignments}</p>
              <p className="text-[10px] text-muted-foreground">Auto-affectations</p>
            </div>
            <div className="bg-card/30 rounded-lg p-2 text-center">
              <p className="text-lg font-bold text-primary">{stats.accuracy}%</p>
              <p className="text-[10px] text-muted-foreground">Précision</p>
            </div>
          </div>
        ) : (
          !isActive && (
            <p className="text-xs text-muted-foreground text-center py-1">
              Les statistiques IA s'afficheront une fois le backend connecté.
            </p>
          )
        )}
      </CardContent>
    </Card>
  );
};

export default AIEngine;
