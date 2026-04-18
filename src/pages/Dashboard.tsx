// ============================================================
// ORION — Page : Dashboard
// Vue principale de l'opérateur
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Hooks React Query
import { useAgents } from "@/hooks/queries/useAgents";
import { useIncidents } from "@/hooks/queries/useIncidents";
import { useStatistics } from "@/hooks/queries/useStatistics";
import { useAgentsDisponibles } from "@/hooks/queries/useAgentsDisponibles";
import { useAssignIncident } from "@/hooks/mutations/useAssignIncident";

// Autres
import { useOrionSocket } from "@/hooks/useOrionSocket";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("pending");
  const [filterType, setFilterType] = useState<string>("");
  const [filterUrgency, setFilterUrgency] = useState<string>("");

  const [selectedIncidentForAssignment, setSelectedIncidentForAssignment] = useState<string | null>(null);

  // ── Données depuis l'API (React Query) ───────────────────────
  const { data: agents = [], isLoading: agentsLoading } = useAgents();
  const { data: agentsDispos = [], isLoading: agentsDisposLoading } = useAgentsDisponibles();
  
  // Utilisation automatique des filtres (React Query re-fetch si les filtres changent)
  const filters: Record<string, string> = {};
  if (filterStatus) filters.status = filterStatus;
  if (filterType) filters.type = filterType;
  if (filterUrgency) filters.urgency = filterUrgency;

  const { data: incidents = [], isLoading: incidentsLoading } = useIncidents(filters);
  const { data: backendStats } = useStatistics();

  // ── Mutation pour affecter un agent ──────────────────────────
  const { mutate: assignAgent, isPending: isAssigning } = useAssignIncident();

  // ── WebSocket temps réel ─
  const { isConnected } = useOrionSocket();

  // ── Logic basique pour la vue ───────────────────────────────
  const filteredIncidents = incidents.filter(i => {
    const matchesSearch = !searchQuery || i.type.toLowerCase().includes(searchQuery.toLowerCase()) || i.location.toLowerCase().includes(searchQuery.toLowerCase()) || i.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !filterStatus || i.status === filterStatus;
    const matchesUrgency = !filterUrgency || i.urgency === filterUrgency;
    return matchesSearch && matchesStatus && matchesUrgency;
  });

  const activeCount = backendStats ? Object.values(backendStats.byStatus || {}).reduce((a,b) => a+b, 0) : incidents.length;
  const pendingCount = backendStats?.byStatus?.["pending"] || incidents.filter(i => i.status === "pending").length;

  const handleAssignAgent = (incidentId: string) => {
    // Étape 1 : Ouvrir la popup
    setSelectedIncidentForAssignment(incidentId);
  };

  const confirmAssignment = (agentId: string) => {
    if (selectedIncidentForAssignment) {
      assignAgent({
        id: selectedIncidentForAssignment,
        payload: { agentAssigneId: agentId, statut: "ASSIGNE" }
      });
      setSelectedIncidentForAssignment(null);
    }
  };

  const handleUnassignAgent = (incidentId: string) => {
    assignAgent({
      id: incidentId,
      payload: { agentAssigneId: null, statut: "EN_ATTENTE" } // Désaffectation
    });
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
            trend={`${pendingCount} en attente`}
            variant="warning"
          />
          <StatsCard
            title="Agents disponibles"
            value={agentsDispos.length.toString()}
            icon={Users}
            trend={`${agents.length - agentsDispos.length} en intervention`}
            variant="success"
          />
          <StatsCard
            title="Types le plus fréquent"
            value={backendStats && Object.keys(backendStats.byType || {}).length > 0 
                ? Object.keys(backendStats.byType).reduce((a, b) => backendStats.byType[a] > backendStats.byType[b] ? a : b) 
                : "—"}
            icon={Activity}
            trend={backendStats ? "Depuis API Stats" : "En attente API"}
            variant="default"
          />
          <StatsCard
            title="Urgences max"
            value={backendStats?.byPriority?.["urgent"]?.toString() || "0"}
            icon={AlertTriangle}
            trend="Statistiques backend"
            variant="destructive"
          />
        </div>

        {/* Contenu principal */}
        <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
          {/* Carte temps réel */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-heading font-bold">Vue d'ensemble</h2>
              <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
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
            {/* Recherche & Filtres */}
            <div className="space-y-2">
              <Input
                placeholder="Rechercher incidents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10"
              />
              <div className="flex gap-2">
                <select 
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
                  value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                >
                  <option value="">Tous les statuts</option>
                  <option value="pending">En attente</option>
                  <option value="assigned">Assigné</option>
                  <option value="in_progress">En cours</option>
                  <option value="resolved">Résolu</option>
                </select>
                <select 
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
                  value={filterUrgency} onChange={e => setFilterUrgency(e.target.value)}
                >
                  <option value="">Toutes urgences</option>
                  <option value="low">Basse</option>
                  <option value="medium">Moyenne</option>
                  <option value="urgent">Urgente</option>
                </select>
              </div>
            </div>

            {/* Liste des incidents */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-heading font-semibold">Incidents récents</h3>
              </div>
              <ScrollArea className="h-[350px] pr-4">
                {incidentsLoading ? (
                  <LoadingSpinner />
                ) : filteredIncidents.length === 0 ? (
                  <EmptyState message="Aucun incident" description="" />
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
                        onUnassign={handleUnassignAgent}
                      />
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>

            {/* Liste des agents dispo */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-heading font-semibold">Agents Disponibles</h3>
              </div>
              <ScrollArea className="h-[200px] pr-4">
                  {agentsDisposLoading ? (
                    <LoadingSpinner />
                  ) : agentsDispos.length === 0 ? (
                    <EmptyState message="Aucun agent disponible" description="" />
                  ) : (
                    <div className="space-y-3">
                      {agentsDispos.map((agent: any) => (
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
              </ScrollArea>
            </div>
          </div>
        </div>
      </main>

      {/* Modal d'assignation */}
      <Dialog open={!!selectedIncidentForAssignment} onOpenChange={() => setSelectedIncidentForAssignment(null)}>
        <DialogContent>
            <DialogHeader>
              <DialogTitle>Assigner un agent disponible</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
               {agentsDispos.length === 0 && <p className="text-sm text-muted-foreground">Aucun agent disponible pour le moment.</p>}
               {agentsDispos.map((agent: any) => (
                 <div key={agent.id} className="flex justify-between items-center border p-2 rounded">
                    <span>{agent.name}</span>
                    <Button size="sm" onClick={() => confirmAssignment(agent.id)} disabled={isAssigning}>
                      Assigner
                    </Button>
                 </div>
               ))}
            </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
