import 'leaflet/dist/leaflet.css';

import { Campo, Coordinada, Lote } from '@/types/campos.types';
import {
  MapContainer,
  Polygon,
  TileLayer,
  useMap,
  useMapEvents,
} from 'react-leaflet';

import { LatLngExpression } from 'leaflet';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

interface Props {
  lotes: Lote[];
  actualLote?: Lote;
  handleLote?: (point: Coordinada) => void;
  enable?: boolean;
  size?: string;
  customCenter?: boolean;
  centerByEdit?: LatLngExpression;
  className?: string;
  customZoom?: number;
  selectedCampo: Campo;
}

const MapFlyTo = ({ selectedCampo }: { selectedCampo: Campo }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedCampo) {
      const { lat, lng } = selectedCampo.Lote?.[0]
        ?.Coordinada?.[0] as Coordinada;
      map.flyTo([lat, lng], 14, {
        duration: 1.5, // Duración de la animación en segundos
      });
    }
  }, [selectedCampo, map]);

  return null;
};

export default function Map({
  lotes,
  actualLote,
  handleLote,
  enable,
  size,
  customCenter,
  centerByEdit,
  className,
  customZoom,
  selectedCampo,
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

  const CENTER =
    (centerByEdit ?? customCenter)
      ? [
          lotes[0]?.Coordinada?.[0]?.lat ?? -37.31587,
          lotes[0]?.Coordinada?.[0]?.lng ?? -59.98368,
        ]
      : [-37.31587, -59.98368];

  return (
    <div
      className={className}
      onTouchStart={(e) => e.isPropagationStopped}
      onClick={(e) => e.stopPropagation()}
      onMouseEnter={() => console.log('entering')}
      onMouseDown={(e) => e.isPropagationStopped}
    >
      <MapContainer
        id='map'
        className={cn(
          'pointer-events-auto relative z-10 h-full w-full overflow-hidden rounded-lg',
          size || '!h-[40dvh]',
        )}
        center={CENTER as LatLngExpression}
        zoom={customZoom ?? 15}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.esri.com">Esri</a> &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community'
          url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        />
        <MapFlyTo selectedCampo={selectedCampo} />
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
    </div>
  );
}
