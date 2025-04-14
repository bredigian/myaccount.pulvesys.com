'use client';

import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

import { Campo, Coordinada } from '@/types/campos.types';
import { Layer, Map, Source, useControl, useMap } from 'react-map-gl/mapbox';
import MapboxDraw, {
  DrawCreateEvent,
  DrawDeleteEvent,
  DrawUpdateEvent,
} from '@mapbox/mapbox-gl-draw';
import { calcularCentroide, cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';

import { FeatureCollection } from 'geojson';
import { PolygonFeature } from './campos-form';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
const MAP_STYLE = 'mapbox://styles/mapbox/satellite-streets-v12';

interface DrawControlProps {
  onCreate: (e: DrawCreateEvent) => void;
  onUpdate: (e: DrawUpdateEvent) => void;
  onDelete: (e: DrawDeleteEvent) => void;
  polygons: PolygonFeature[];
}

const DrawControl = ({
  onCreate,
  onUpdate,
  onDelete,
  polygons,
}: DrawControlProps) => {
  const drawRef = useRef<MapboxDraw | null>(null);

  const control = useControl(
    ({ map }) => {
      const draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          polygon: true,
          trash: true,
        },
      });

      drawRef.current = draw;
      map.addControl(draw);

      map.on('draw.create', onCreate);
      map.on('draw.update', onUpdate);
      map.on('draw.delete', onDelete);

      return draw;
    },
    ({ map }) => {
      if (drawRef.current) {
        map.removeControl(drawRef.current);
        drawRef.current = null;
      }
    },
  );

  useEffect(() => {
    control.set({
      type: 'FeatureCollection',
      features: polygons,
    });
  }, [polygons]);

  return null;
};

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
  size?: string;
  customCenter?: boolean;
  className?: string;
  customZoom?: number;
  selectedCampo?: Campo;

  onCreate?: (e: DrawCreateEvent) => void;
  onUpdate?: (e: DrawUpdateEvent) => void;
  onDelete?: (e: DrawDeleteEvent) => void;

  polygons: PolygonFeature[];

  isPulverizacionDetail?: boolean;
}

export default function MapboxMap({
  size,
  customZoom,
  className,
  selectedCampo,

  onCreate,
  onUpdate,
  onDelete,

  polygons,

  isPulverizacionDetail,
}: Props) {
  const [geoJSON, setGeoJSON] = useState<FeatureCollection>({
    type: 'FeatureCollection',
    features: [],
  });

  const [textGeoJSON, setTextGeoJSON] = useState<FeatureCollection>({
    type: 'FeatureCollection',
    features: [],
  });

  useEffect(() => {
    setTextGeoJSON({
      type: 'FeatureCollection',
      features: polygons?.map((item) => {
        const centroide = calcularCentroide(item.geometry.coordinates[0]);
        return {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: centroide,
          },
          properties: {
            nombre: item.properties.name,
            description: item.properties.description,
            opacity: isPulverizacionDetail ? item.properties.opacity : 1,
          },
        };
      }),
    });

    setGeoJSON({
      type: 'FeatureCollection',
      features: polygons?.map((item) => {
        return {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [item.geometry.coordinates[0]],
          },
          properties: {
            nombre: item.properties.nombre,
            color: item.properties.color,
            description: item.properties.description,
            opacity: item.properties.opacity,
          },
        };
      }),
    });
  }, [polygons]);

  return (
    <div
      className={cn(
        'pointer-events-auto relative z-10 h-full w-full overflow-hidden rounded-lg duration-200 ease-in-out',
        size ?? '!h-[40dvh]',
        className,
      )}
    >
      <Map
        initialViewState={{
          zoom: customZoom ?? 12,
          latitude:
            polygons?.[0]?.geometry?.coordinates?.[0]?.[0]?.[1] || -37.31587,
          longitude:
            polygons?.[0]?.geometry?.coordinates?.[0]?.[0]?.[0] || -59.98368,
        }}
        mapboxAccessToken={MAPBOX_TOKEN}
        mapStyle={MAP_STYLE}
        style={{ width: '100%', height: '100%' }}
        id='map-for-pdf'
        preserveDrawingBuffer
      >
        {selectedCampo && <FlyTo selectedCampo={selectedCampo} />}
        {onCreate && onUpdate && onDelete && (
          <DrawControl
            onCreate={onCreate}
            onUpdate={onUpdate}
            onDelete={onDelete}
            polygons={polygons}
          />
        )}
        <Source id='lotes-source' type='geojson' data={geoJSON}>
          <Layer
            id='borders-layer'
            type='line'
            paint={{
              'line-color': ['get', 'color'],
              'line-width': 4,
              'line-opacity': ['get', 'opacity'],
            }}
          />
          <Layer
            id='lotes-layer'
            type='fill'
            paint={{
              'fill-color': ['get', 'color'],
              'fill-opacity': ['get', 'opacity'],
            }}
          />
        </Source>
        <Source id='lotes-text-source' type='geojson' data={textGeoJSON}>
          <Layer
            id='lotes-text-layer'
            type='symbol'
            layout={{
              'text-field': ['get', 'description'],
              'text-size': 12,
              'text-anchor': 'center',
              'text-justify': 'center',
              'text-font': ['Open Sans Bold'],
            }}
            paint={{
              'text-color': '#ffffff',
              'text-halo-color': '#000000',
              'text-halo-width': 1.2,
              'text-opacity': ['get', 'opacity'],
            }}
          />
        </Source>
      </Map>
    </div>
  );
}
