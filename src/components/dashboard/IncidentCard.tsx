import { AlertTriangle, MapPin, Clock, User, Camera, Brain } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { IncidentUrgency, IncidentStatus, IncidentSource, AssignedBy } from "@/types/incident.types";

interface IncidentCardProps {
  id: string;
  type: string;
  location: string;
  urgency: IncidentUrgency;
  status: IncidentStatus;
  agent?: string;
  time: string;
  onAssign?: (id: string) => void;
  source?: IncidentSource;
  cameraId?: string;
  assignedBy?: AssignedBy;
}

const IncidentCard = ({ id, type, location, urgency, status, agent, time, onAssign, source, cameraId, assignedBy }: IncidentCardProps) => {
  const urgencyVariants = {
    urgent: { variant: "warning" as const, text: "Urgent" },
    medium: { variant: "default" as const, text: "Moyen" },
    low: { variant: "success" as const, text: "Faible" },
  };

  const statusVariants: Record<IncidentStatus, { variant: "outline" | "default" | "success" | "warning"; text: string }> = {
    pending: { variant: "outline", text: "En attente" },
    assigned: { variant: "default", text: "Assigné" },
    in_progress: { variant: "warning", text: "En cours" },
    resolved: { variant: "success", text: "Résolu" },
    closed: { variant: "outline", text: "Clôturé" },
  };

  return (
    <Card className="transition-orion hover:shadow-orion animate-fade-in">
      <CardContent className="p-4">
        {source === "camera" && cameraId && (
          <div className="flex items-center gap-2 mb-2 text-xs bg-primary/5 rounded px-2 py-1 border border-primary/20">
            <Camera className="h-3 w-3 text-primary" />
            <span className="text-primary font-medium">Détecté par Caméra #{cameraId}</span>
          </div>
        )}

        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-warning/10 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-warning" />
            </div>
            <div>
              <h4 className="font-semibold text-sm">{type}</h4>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <Clock className="h-3 w-3" />
                <span>{time}</span>
              </div>
            </div>
          </div>
          <Badge variant={urgencyVariants[urgency].variant}>
            {urgencyVariants[urgency].text}
          </Badge>
        </div>

        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">{location}</span>
          </div>

          {agent && (
            <div className="flex items-center gap-2 text-sm">
              <User className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">{agent}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant={statusVariants[status].variant} className="text-xs">
              {statusVariants[status].text}
            </Badge>
            {assignedBy === "ai" && status === "assigned" && (
              <Badge variant="default" className="text-[10px] gap-1 bg-primary/10 text-primary border-primary/20">
                <Brain className="h-2.5 w-2.5" />
                Affecté par IA
              </Badge>
            )}
          </div>

          {status === "pending" && onAssign && (
            <Button
              size="sm"
              variant="gradient"
              onClick={() => onAssign(id)}
            >
              Affecter
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default IncidentCard;
