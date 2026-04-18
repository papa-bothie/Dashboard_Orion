// ============================================================
// ORION — Page : Détail Incident
// Réservé à la vue opérateur avec accès à l'historique
// ============================================================

import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import { useIncident } from "@/hooks/queries/useIncident";
import { useIncidentHistorique } from "@/hooks/queries/useIncidentHistorique";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, MapPin, User, AlertTriangle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

export default function IncidentDetail() {
  const { id } = useParams<{ id: string }>();

  const { data: incident, isLoading } = useIncident(id || "");
  const { data: historique, isLoading: isHistoriqueLoading } = useIncidentHistorique(id || "");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex h-[calc(100vh-80px)] items-center justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container px-4 py-6">
          <Button variant="outline" asChild className="mb-4">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Retour
            </Link>
          </Button>
          <div className="text-center py-20">Incident introuvable</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container px-4 py-6 space-y-6">
        <Button variant="outline" asChild>
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour au tableau de bord
          </Link>
        </Button>

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{incident.type}</h1>
            <p className="text-muted-foreground flex items-center mt-2">
              <MapPin className="mr-2 h-4 w-4" /> {incident.location}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold 
              ${incident.urgency === 'urgent' ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}
            `}>
              Urgence: {incident.urgency}
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-secondary text-secondary-foreground">
              Statut: {incident.status}
            </span>
          </div>
        </div>

        <Tabs defaultValue="details" className="w-full mt-6">
          <TabsList>
            <TabsTrigger value="details">Détails de l'incident</TabsTrigger>
            <TabsTrigger value="historique">Historique</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-6 mt-4">
            <Card>
              <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg flex items-center mb-2">
                    <AlertTriangle className="mr-2 h-5 w-5" /> Description
                  </h3>
                  <p className="text-muted-foreground">
                    {incident.description || "Aucune description fournie."}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg flex items-center mb-2">
                    <User className="mr-2 h-5 w-5" /> Assignation
                  </h3>
                  {incident.assignedAgent ? (
                    <p>Agent assigné: <span className="font-semibold">{incident.assignedAgent}</span></p>
                  ) : (
                    <p className="text-muted-foreground">Aucun agent actuellement assigné.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
               <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg flex items-center mb-4">Média</h3>
                  <div className="h-64 w-full bg-muted flex items-center justify-center rounded border border-dashed">
                      <p className="text-muted-foreground">Visualisation média (image/vidéo) à intégrer</p>
                  </div>
               </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="historique" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                {isHistoriqueLoading ? (
                  <LoadingSpinner />
                ) : historique && historique.length > 0 ? (
                  <div className="space-y-6 border-l-2 border-primary/20 ml-3 pl-6 relative">
                    {historique.map((event, index) => (
                      <div key={index} className="relative">
                        <div className="absolute -left-[31px] bg-background p-1 rounded-full border-2 border-primary/20">
                          <Clock className="w-4 h-4 text-primary" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(event.date).toLocaleString()} — <span className="font-semibold text-foreground">{event.utilisateur}</span>
                        </p>
                        <p className="mt-1">{event.action}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">Aucun historique disponible pour cet incident.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
