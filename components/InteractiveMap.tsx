"use client";

import { useEffect, useState } from "react";
import L from "leaflet";
import Link from "next/link";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import type { Property } from "@/lib/types";

function MapViewport({ properties }: { properties: Property[] }) {
  const map = useMap();

  useEffect(() => {
    if (properties.length === 0) {
      map.setView([39, -3], 5);
      return;
    }
    const points = properties.map(({ coordinates }) => [coordinates.lat, coordinates.lng] as [number, number]);
    if (points.length === 1) {
      map.setView(points[0], 11);
      return;
    }
    map.fitBounds(L.latLngBounds(points), { padding: [36, 36], maxZoom: 10 });
  }, [map, properties]);

  return null;
}

export default function InteractiveMap({ properties, returnHref }: { properties: Property[]; returnHref: string }) {
  const [tileError, setTileError] = useState(false);

  if (tileError) {
    return (
      <div aria-label="Mapa no disponible" className="grid min-h-56 place-items-center rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 text-center md:sticky md:top-28 md:min-h-[calc(100vh-9rem)]" role="img">
        <p className="max-w-xs text-sm text-[var(--muted)]">No se pudo cargar el mapa. Los alojamientos siguen disponibles en la lista.</p>
      </div>
    );
  }

  return (
    <div aria-label="Mapa de resultados" className="relative min-h-56 overflow-hidden rounded-2xl border border-[var(--line)] md:sticky md:top-28 md:min-h-[calc(100vh-9rem)]" role="region">
      <MapContainer center={[39, -3]} className="h-72 w-full md:!h-[calc(100vh-9rem)]" scrollWheelZoom={false} zoom={5}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          eventHandlers={{ tileerror: () => setTileError(true) }}
          maxZoom={19}
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapViewport properties={properties} />
        {properties.map((property) => {
          const price = new Intl.NumberFormat("es-ES", { style: "currency", currency: property.currency, maximumFractionDigits: 0 }).format(property.pricePerNight);
          const icon = L.divIcon({
            className: "stay-marker",
            html: `<span>${price}</span>`,
            iconSize: [74, 34],
            iconAnchor: [37, 17],
          });
          const href = `/property/${encodeURIComponent(property.id)}?${new URLSearchParams({ returnTo: returnHref }).toString()}`;

          return (
            <Marker alt={property.title} icon={icon} key={property.id} position={[property.coordinates.lat, property.coordinates.lng]} title={property.title}>
              <Popup>
                <div className="grid gap-1">
                  <strong>{property.title}</strong>
                  <span>{property.location}</span>
                  <span>{price} por noche</span>
                  <Link className="mt-1 font-semibold text-[#087f6f] underline" href={href}>Ver alojamiento</Link>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}