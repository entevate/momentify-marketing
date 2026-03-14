"use client";

import { useEffect, useRef, useMemo } from "react";
import { MapContainer, TileLayer, CircleMarker, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import type { DashboardEvent } from "./types";
import { PopupContent } from "./EventMapView";
import "leaflet/dist/leaflet.css";

interface LocationEntry {
  location: string;
  coords: { lat: number; lng: number };
  events: DashboardEvent[];
  color: string;
}

interface EventMapInnerProps {
  locations: LocationEntry[];
}

/* Fit map bounds when locations change */
function FitBounds({ locations }: { locations: LocationEntry[] }) {
  const map = useMap();

  useEffect(() => {
    if (locations.length === 0) return;
    if (locations.length === 1) {
      map.setView([locations[0].coords.lat, locations[0].coords.lng], 6);
      return;
    }
    const bounds = locations.map((l) => [l.coords.lat, l.coords.lng] as [number, number]);
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 6 });
  }, [locations, map]);

  return null;
}

/* Pulsating ring for live events using a DivIcon overlay */
function PulseRing({ lat, lng }: { lat: number; lng: number }) {
  const icon = L.divIcon({
    className: "",
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    html: '<div class="leaflet-pulse-ring"></div>',
  });

  return <Marker position={[lat, lng]} icon={icon} interactive={false} />;
}

function MapMarker({
  entry,
  radius,
  isLive,
}: {
  entry: LocationEntry;
  radius: number;
  isLive: boolean;
}) {
  return (
    <>
      {isLive && (
        <PulseRing lat={entry.coords.lat} lng={entry.coords.lng} />
      )}
      <CircleMarker
        center={[entry.coords.lat, entry.coords.lng]}
        radius={radius}
        pathOptions={{
          fillColor: entry.color,
          fillOpacity: 0.85,
          color: "#ffffff",
          weight: 2.5,
          opacity: 1,
        }}
      >
        <Popup
          maxWidth={280}
          minWidth={240}
          closeButton={true}
          className="event-map-leaflet-popup"
        >
          <PopupContent events={entry.events} />
        </Popup>
      </CircleMarker>
    </>
  );
}

export default function EventMapInner({ locations }: EventMapInnerProps) {
  return (
    <MapContainer
      center={[39, -98]}
      zoom={4}
      minZoom={3}
      maxZoom={12}
      style={{ width: "100%", height: "100%" }}
      zoomControl={true}
      attributionControl={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      <FitBounds locations={locations} />
      {locations.map((entry) => {
        const isLive = entry.events.some((e) => e.status === "live");
        const radius = 8 + (entry.events.length - 1) * 3;

        return (
          <MapMarker
            key={entry.location}
            entry={entry}
            radius={radius}
            isLive={isLive}
          />
        );
      })}
    </MapContainer>
  );
}
