"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export type LatLng = { lat: number; lng: number };

const pinIcon = L.divIcon({
  className: "onko-map-pin",
  html: `<div style="
      width:28px;height:28px;border-radius:50% 50% 50% 0;
      background:#6F2380;transform:rotate(-45deg);
      border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.35);
    "></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 26],
});

function ClickHandler({ onPick }: { onPick: (p: LatLng) => void }) {
  useMapEvents({
    click(e) {
      onPick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

function Recenter({ position }: { position: LatLng | null }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView([position.lat, position.lng], Math.max(map.getZoom(), 13), {
        animate: true,
      });
    }
  }, [position, map]);
  return null;
}

export default function LeafletMap({
  position,
  defaultCenter,
  defaultZoom = 7,
  onPick,
}: {
  position: LatLng | null;
  defaultCenter: LatLng;
  defaultZoom?: number;
  onPick: (p: LatLng) => void;
}) {
  return (
    <MapContainer
      center={position ?? defaultCenter}
      zoom={position ? 13 : defaultZoom}
      scrollWheelZoom
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ClickHandler onPick={onPick} />
      <Recenter position={position} />
      {position && (
        <Marker
          position={position}
          icon={pinIcon}
          draggable
          eventHandlers={{
            dragend(e) {
              const m = e.target as L.Marker;
              const p = m.getLatLng();
              onPick({ lat: p.lat, lng: p.lng });
            },
          }}
        />
      )}
    </MapContainer>
  );
}
