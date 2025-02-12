'use client';

import 'mapbox-gl/dist/mapbox-gl.css';

import { Campo, Coordinada, Lote } from '@/types/campos.types';
import { Layer, Map, Source, useMap } from 'react-map-gl/mapbox';
import { calcularCentroide, cn } from '@/lib/utils';

import { FeatureCollection } from 'geojson';
import { useEffect } from 'react';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
const MAP_STYLE = 'mapbox://styles/mapbox/satellite-streets-v12';

const FlyTo = ({ selectedCampo }: { selectedCampo: Campo }) => {
  const { current } = useMap();

  useEffect(() => {
    if (selectedCampo) {
      const { lat, lng } = selectedCampo.Lote?.[0]
        ?.Coordinada?.[0] as Coordinada;
      current?.flyTo({ animate: true, center: [lng, lat] });
    }
  }, [selectedCampo]);

  return null;
};

interface Props {
  lotesCampo: Lote[];
  lotesPulverizados: Lote[];
  actualLote?: Lote;
  handleLote?: (point: Coordinada) => void;
  enable?: boolean;
  size?: string;
  customCenter?: boolean;
  className?: string;
  customZoom?: number;
  selectedCampo?: Campo;
}

export default function MapboxMap({
  lotesCampo,
  lotesPulverizados,
  size,
  customZoom,
  className,
  selectedCampo,
}: Props) {
  const geoJSON: FeatureCollection = {
    type: 'FeatureCollection',
    features: lotesCampo.map((lote) => {
      const coords = lote.Coordinada?.map((coord) => [
        coord.lng,
        coord.lat,
      ]).filter(Boolean) as number[][];

      if (coords?.[0] !== coords?.[coords.length - 1]) {
        coords?.push(coords[0]);
      }

      return {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [coords],
        },
        properties: {
          nombre: lote.nombre,
          color: lote.color || '#008000',
          isPulverizado: lotesPulverizados.includes(lote) ? 0.75 : 0.2,
        },
      };
    }),
  };

  const textGeoJSON: FeatureCollection = {
    type: 'FeatureCollection',
    features: lotesCampo.map((lote) => {
      const centroide = calcularCentroide(lote.Coordinada as Coordinada[]);
      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: centroide,
        },
        properties: {
          nombre: lote.nombre,
          isPulverizado: lotesPulverizados.includes(lote) ? 1 : 0.35,
        },
      };
    }),
  };

  return (
    <div
      className={cn(
        'pointer-events-auto relative z-10 h-full w-full overflow-hidden rounded-lg',
        size ?? '!h-[40dvh]',
        className,
      )}
    >
      <Map
        initialViewState={{
          zoom: customZoom ?? 12,
          latitude: lotesCampo[0].Coordinada?.[0].lat,
          longitude: lotesCampo[0].Coordinada?.[0].lng,
        }}
        mapboxAccessToken={MAPBOX_TOKEN}
        mapStyle={MAP_STYLE}
        style={{ width: '100%', height: '100%' }}
        id='map-for-pdf'
        preserveDrawingBuffer
      >
        {selectedCampo && <FlyTo selectedCampo={selectedCampo} />}
        <Source id='lotes-source' type='geojson' data={geoJSON}>
          <Layer
            id='lotes-layer'
            type='fill'
            paint={{
              'fill-color': ['get', 'color'],
              'fill-opacity': ['get', 'isPulverizado'],
            }}
          />
          <Layer
            id='borders-layer'
            type='line'
            paint={{
              'line-color': ['get', 'color'],
              'line-width': 2,
              'line-opacity': ['get', 'isPulverizado'],
            }}
          />
        </Source>
        <Source id='lotes-text-source' type='geojson' data={textGeoJSON}>
          <Layer
            id='lotes-text-layer'
            type='symbol'
            layout={{
              'text-field': ['get', 'nombre'],
              'text-size': 12,
              'text-anchor': 'center',
              'text-justify': 'center',
              'text-font': ['Open Sans Bold'],
            }}
            paint={{
              'text-color': '#ffffff',
              'text-halo-color': '#000000',
              'text-halo-width': 1.2,
              'text-opacity': ['get', 'isPulverizado'],
            }}
          />
        </Source>
      </Map>
    </div>
  );
}
