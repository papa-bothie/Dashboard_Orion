// ============================================================
// ORION — Composant : MapView
// Carte interactive Leaflet — REFACTORISÉ
// Reçoit agents et incidents en props (plus de demoMarkers hardcodés)
// ============================================================

import { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Agent } from "@/types/agent.types";
import type { Incident } from "@/types/incident.types";

// Fix Leaflet default marker icon issue with Vite
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface MapViewProps {
  agents?: Agent[];
  incidents?: Incident[];
  onMarkerClick?: (id: string, type: "agent" | "incident") => void;
}

// Couleurs selon le statut
const AGENT_COLORS: Record<Agent["status"], string> = {
  available: "#10b981",
  busy: "#f59e0b",
  offline: "#ef4444",
};

const INCIDENT_COLORS: Record<Incident["urgency"], string> = {
  urgent: "#f59e0b",
  medium: "#3b82f6",
  low: "#10b981",
};

// Centre par défaut : Dakar, Sénégal
const DEFAULT_CENTER: [number, number] = [14.7167, -17.4677];

const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="position: relative;">
        <div style="
          width: 24px;
          height: 24px;
          background-color: ${color};
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        "></div>
        <div style="
          position: absolute;
          top: 0;
          left: 0;
          width: 24px;
          height: 24px;
          background-color: ${color};
          border-radius: 50%;
          opacity: 0.3;
          animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        "></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

const MapView = ({
  agents = [],
  incidents = [],
  onMarkerClick,
}: MapViewProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  // Initialisation de la carte (une seule fois)
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: DEFAULT_CENTER,
      zoom: 11,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mise à jour des marqueurs quand agents/incidents changent
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Supprimer les anciens marqueurs
    if (markersLayerRef.current) {
      map.removeLayer(markersLayerRef.current);
    }

    const group = L.layerGroup();

    // Marqueurs agents
    agents.forEach((agent) => {
      const color = AGENT_COLORS[agent.status];
      const marker = L.marker([agent.lat, agent.lng], {
        icon: createCustomIcon(color),
      });

      marker.on("click", () => onMarkerClick?.(agent.id, "agent"));
      marker.bindPopup(`
        <div class="p-2">
          <p class="font-semibold text-sm">${agent.name}</p>
          <p class="text-xs text-gray-500">${agent.location}</p>
          <span class="mt-1 text-xs inline-block rounded border px-2 py-0.5">Agent</span>
        </div>
      `);
      marker.addTo(group);
    });

    // Marqueurs incidents
    incidents.forEach((incident) => {
      const color = INCIDENT_COLORS[incident.urgency];
      const marker = L.marker([incident.lat, incident.lng], {
        icon: createCustomIcon(color),
      });

      marker.on("click", () => onMarkerClick?.(incident.id, "incident"));
      marker.bindPopup(`
        <div class="p-2">
          <p class="font-semibold text-sm">${incident.type}</p>
          <p class="text-xs text-gray-500">${incident.location}</p>
          <span class="mt-1 text-xs inline-block rounded border px-2 py-0.5">Incident</span>
        </div>
      `);
      marker.addTo(group);
    });

    group.addTo(map);
    markersLayerRef.current = group;
  }, [agents, incidents, onMarkerClick]);

  // Statistiques dynamiques (calculées depuis les props réelles)
  const mapStats = useMemo(
    () => ({
      agentsActive: agents.filter((a) => a.status !== "offline").length,
      incidentsInProgress: incidents.filter(
        (i) => i.status === "assigned" || i.status === "in_progress"
      ).length,
      hasData: agents.length > 0 || incidents.length > 0,
    }),
    [agents, incidents]
  );

  return (
    <div className="relative h-full w-full rounded-xl overflow-hidden shadow-orion-lg">
      <div ref={containerRef} className="absolute inset-0" />

      {/* Légende */}
      <div className="absolute top-4 left-4 z-10 bg-card/95 backdrop-blur rounded-lg p-3 shadow-orion">
        <h4 className="text-xs font-semibold mb-2">Légende</h4>
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-success" />
            <span>Agent disponible</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-warning" />
            <span>En intervention</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-primary" />
            <span>Incident</span>
          </div>
        </div>
      </div>

      {/* Overlay statistiques — données réelles ou placeholder */}
      <div className="absolute bottom-4 left-4 right-4 z-10 bg-card/95 backdrop-blur rounded-lg p-3 shadow-orion">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-success">
              {mapStats.hasData ? mapStats.agentsActive : "—"}
            </p>
            <p className="text-xs text-muted-foreground">Agents actifs</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-warning">
              {mapStats.hasData ? mapStats.incidentsInProgress : "—"}
            </p>
            <p className="text-xs text-muted-foreground">En cours</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary">
              {mapStats.hasData ? `${agents.length + incidents.length}` : "—"}
            </p>
            <p className="text-xs text-muted-foreground">Sur la carte</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
