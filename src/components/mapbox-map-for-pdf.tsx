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
  actualLote,
  lotesCampo,
  lotesPulverizados,
  size,
  customZoom,
  className,
  selectedCampo,
  enable,
  handleLote,
}: Props) {
  const actualGeoJSON: FeatureCollection = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: actualLote?.zona
            ? [actualLote.zona.map((c) => [c.lng, c.lat])]
            : [],
        },
        properties: {
          color: actualLote?.color,
          opacity: 0.75,
        },
      },
    ],
  };

  const geoJSON: FeatureCollection = {
    type: 'FeatureCollection',
    features: lotesCampo.map((lote) => {
      const coords = (lote.Coordinada ?? lote.zona)
        .map((coord) => [coord.lng, coord.lat])
        .filter(Boolean) as number[][];

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
      const centroide = calcularCentroide(
        (lote.Coordinada ?? lote.zona) as Coordinada[],
      );
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
          latitude: lotesCampo?.[0]?.Coordinada?.[0]?.lat ?? -37.31587,
          longitude: lotesCampo?.[0]?.Coordinada?.[0]?.lng ?? -59.98368,
        }}
        mapboxAccessToken={MAPBOX_TOKEN}
        mapStyle={MAP_STYLE}
        style={{ width: '100%', height: '100%' }}
        id='map-for-pdf'
        preserveDrawingBuffer
        onClick={(e) => {
          if (enable) {
            const punto: Coordinada = {
              lat: e.lngLat.lat,
              lng: e.lngLat.lng,
            };
            if (handleLote) handleLote(punto);
          }
        }}
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
        {actualLote && (
          <Source
            key={`actual_lote-source`}
            type='geojson'
            data={actualGeoJSON}
          >
            <Layer
              id='actual_lote-layer'
              type='fill'
              paint={{
                'fill-color': ['get', 'color'],
                'fill-opacity': ['get', 'opacity'],
              }}
            />
            <Layer
              id='actual_lote-border'
              type='line'
              paint={{
                'line-color': ['get', 'color'],
                'line-width': 2,
                'line-opacity': 1,
              }}
            />
            <Layer
              id='actual_lote-point'
              type='circle'
              paint={{
                'circle-color': ['get', 'color'],
                'circle-stroke-width': 1,
                'circle-opacity': 1,
                'circle-stroke-color': ['get', 'color'],
              }}
            />
          </Source>
        )}
      </Map>
    </div>
  );
}
