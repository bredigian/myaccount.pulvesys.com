import 'leaflet/dist/leaflet.css';

import { Coordinada, Lote } from '@/types/campos.types';
import { MapContainer, Polygon, TileLayer, useMapEvents } from 'react-leaflet';

import React from 'react';

interface Props {
  lotes: Lote[];
  actualLote: Lote;
  handleLote: (point: Coordinada) => void;
  enable: boolean;
}

export default function Map({ lotes, actualLote, handleLote, enable }: Props) {
  const AddMarker = () => {
    useMapEvents({
      click: (e) => {
        if (enable) {
          const punto: Coordinada = {
            lat: e.latlng.lat,
            lng: e.latlng.lng,
          };
          handleLote(punto);
        }
      },
    });
    return null;
  };
  return (
    <MapContainer
      className='relative !h-[40vh] overflow-hidden rounded-lg'
      center={[-37.31587, -59.98368]}
      zoom={15}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.esri.com">Esri</a> &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community'
        url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      />
      <Polygon
        key={`actual-${actualLote.nombre}`}
        positions={actualLote.zona}
      />
      {lotes.map((lote) => (
        <Polygon
          key={lote.nombre}
          eventHandlers={{ click: (e) => console.log(e) }}
          positions={lote.zona}
          color={lote.color as string}
        />
      ))}

      <AddMarker />
    </MapContainer>
  );
}
