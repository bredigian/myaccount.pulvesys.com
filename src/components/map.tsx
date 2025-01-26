import 'leaflet/dist/leaflet.css';

import { Coordinada, Lote } from '@/types/campos.types';
import { MapContainer, Polygon, TileLayer, useMapEvents } from 'react-leaflet';

import { LatLngExpression } from 'leaflet';
import React from 'react';
import { cn } from '@/lib/utils';

interface Props {
  lotes: Lote[];
  actualLote?: Lote;
  handleLote?: (point: Coordinada) => void;
  enable?: boolean;
  size?: string;
  customCenter?: boolean;
}

export default function Map({
  lotes,
  actualLote,
  handleLote,
  enable,
  size,
  customCenter,
}: Props) {
  const AddMarker = () => {
    useMapEvents({
      click: (e) => {
        if (enable) {
          const punto: Coordinada = {
            lat: e.latlng.lat,
            lng: e.latlng.lng,
          };
          if (handleLote) handleLote(punto);
        }
      },
    });
    return null;
  };

  const CENTER = customCenter
    ? [
        lotes[0]?.Coordinada[0]?.lat ?? -37.31587,
        lotes[0]?.Coordinada[0]?.lng ?? -59.98368,
      ]
    : [-37.31587, -59.98368];

  console.log(lotes);

  return (
    <MapContainer
      className={cn(
        'relative overflow-hidden rounded-lg',
        size || '!h-[40dvh]',
      )}
      center={CENTER as LatLngExpression}
      zoom={15}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.esri.com">Esri</a> &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community'
        url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      />
      {actualLote && (
        <Polygon
          key={`actual-${actualLote.nombre}`}
          positions={actualLote.zona}
        />
      )}

      {lotes.length > 0 &&
        lotes?.map((lote) => (
          <Polygon
            key={lote.nombre}
            eventHandlers={{ click: (e) => console.log(e) }}
            positions={(lote.Coordinada as Coordinada[]) ?? lote.zona}
            color={lote.color as string}
          />
        ))}

      <AddMarker />
    </MapContainer>
  );
}
