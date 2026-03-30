// ============================================================
// ORION — Page : Dashboard
// Vue principale de l'opérateur — REFACTORISÉ
// Plus aucune donnée codée en dur
// ============================================================

import { useState } from "react";
import { Activity, Users, AlertTriangle, Clock } from "lucide-react";
import Header from "@/components/Header";
import StatsCard from "@/components/dashboard/StatsCard";
import IncidentCard from "@/components/dashboard/IncidentCard";
import AgentCard from "@/components/dashboard/AgentCard";
import MapView from "@/components/dashboard/MapView";
import AIEngine from "@/components/dashboard/AIEngine";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import EmptyState from "@/components/common/EmptyState";
import { useAgents } from "@/hooks/queries/useAgents";
import { useIncidents } from "@/hooks/queries/useIncidents";
import { useAssignAgent } from "@/hooks/mutations/useAssignAgent";
import { useOrionSocket } from "@/hooks/useOrionSocket";
import { useAgentsLogic } from "@/hooks/business/useAgentsLogic";
import { useIncidentsLogic } from "@/hooks/business/useIncidentsLogic";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // ── Données depuis l'API (React Query) ───────────────────────
  const { data: agents = [], isLoading: agentsLoading } = useAgents();
  const { data: incidents = [], isLoading: incidentsLoading } = useIncidents();

  // ── Mutation pour affecter un agent ──────────────────────────
  const { mutate: assignAgent, isPending: isAssigning } = useAssignAgent();

  // ── WebSocket temps réel (structure prête, pas encore active) ─
  const { isConnected } = useOrionSocket();

  // ── Logique métier encapsulée ─────────────────────────────────
  const { availableAgents, nearbyAgents, stats: agentStats } = useAgentsLogic(agents);
  const { filteredIncidents, activeCount, stats: incidentStats } = useIncidentsLogic(
    incidents,
    searchQuery
  );

  // ── Handler d'affectation manuelle ───────────────────────────
  const handleAssignAgent = (incidentId: string) => {
    const bestAgent = availableAgents[0];
    if (bestAgent) {
      assignAgent({ incidentId, agentId: bestAgent.id });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container px-4 py-6 space-y-6">
        {/* Moteur IA — statut temps réel */}
        <AIEngine isActive={isConnected} />

        {/* Statistiques globales */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Incidents actifs"
            value={activeCount.toString()}
            icon={AlertTriangle}
            trend={`${incidentStats.pending} en attente`}
            variant="warning"
          />
          <StatsCard
            title="Agents disponibles"
            value={agentStats.available.toString()}
            icon={Users}
            trend={`${agentStats.busy} en intervention`}
            variant="success"
          />
          <StatsCard
            title="Temps moyen IA"
            value="—"
            icon={Clock}
            trend="Connexion backend requise"
            variant="default"
          />
          <StatsCard
            title="Précision IA"
            value="—"
            icon={Activity}
            trend="Connexion backend requise"
            variant="success"
          />
        </div>

        {/* Contenu principal */}
        <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
          {/* Carte temps réel */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-heading font-bold">Vue d'ensemble</h2>
              <Button variant="outline" size="sm">
                Actualiser
              </Button>
            </div>
            <div className="h-[600px] w-full">
              <ErrorBoundary>
                <MapView agents={agents} incidents={incidents} />
              </ErrorBoundary>
            </div>
          </div>

          {/* Panneau latéral */}
          <div className="space-y-6">
            {/* Recherche */}
            <Input
              placeholder="Rechercher incidents, agents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11"
            />

            {/* Liste des incidents */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-heading font-semibold">
                  Incidents récents
                </h3>
                <Button variant="link" size="sm">
                  Voir tout
                </Button>
              </div>
              <ScrollArea className="h-[400px] pr-4">
                {incidentsLoading ? (
                  <LoadingSpinner />
                ) : filteredIncidents.length === 0 ? (
                  <EmptyState
                    message="Aucun incident en cours"
                    description="Les incidents apparaîtront ici dès qu'ils seront détectés."
                  />
                ) : (
                  <div className="space-y-3">
                    {filteredIncidents.map((incident) => (
                      <IncidentCard
                        key={incident.id}
                        id={incident.id}
                        type={incident.type}
                        location={incident.location}
                        urgency={incident.urgency}
                        status={incident.status}
                        time={incident.time}
                        source={incident.source}
                        cameraId={incident.cameraId}
                        assignedBy={incident.assignedBy}
                        agent={incident.assignedAgent}
                        onAssign={handleAssignAgent}
                      />
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>

            {/* Liste des agents */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-heading font-semibold">
                  Agents à proximité
                </h3>
                <Button variant="link" size="sm">
                  Voir tout
                </Button>
              </div>
              {agentsLoading ? (
                <LoadingSpinner />
              ) : nearbyAgents.length === 0 ? (
                <EmptyState
                  message="Aucun agent disponible"
                  description="Les agents apparaîtront ici quand ils seront connectés."
                />
              ) : (
                <div className="space-y-3">
                  {nearbyAgents.map((agent) => (
                    <AgentCard
                      key={agent.id}
                      id={agent.id}
                      name={agent.name}
                      status={agent.status}
                      location={agent.location}
                      distance={agent.distance}
                      phone={agent.phone}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
