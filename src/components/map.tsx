'use client';

import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

import { Campo, Coordinada } from '@/types/locations.types';
import { Layer, Map, Source, useControl, useMap } from 'react-map-gl/mapbox';
import MapboxDraw, {
  DrawCreateEvent,
  DrawDeleteEvent,
  DrawMode,
  DrawModeChangeEvent,
  DrawUpdateEvent,
} from '@mapbox/mapbox-gl-draw';
import { calcularCentroide, cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';

import { Check } from 'lucide-react';
import { FeatureCollection } from 'geojson';
import { MAPBOX_DEFAULT_STYLES } from '@/assets/mapbox-styles';
import { PolygonFeature } from './locations-form';
import { useIsMobile } from '@/hooks/use-mobile';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
const MAP_STYLE = 'mapbox://styles/mapbox/satellite-v9';

interface DrawControlProps {
  onCreate: (e: DrawCreateEvent) => void;
  onUpdate: (e: DrawUpdateEvent) => void;
  onDelete: (e: DrawDeleteEvent) => void;

  polygons: PolygonFeature[];
  polygonInDrawing: PolygonFeature | null;

  handleDrawMode: (value: DrawMode) => void;
}

const DrawControl = ({
  onCreate,
  onUpdate,
  onDelete,

  polygons,
  polygonInDrawing,

  handleDrawMode,
}: DrawControlProps) => {
  const drawRef = useRef<MapboxDraw | null>(null);

  const control = useControl(({ map }) => {
    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true,
      },
      styles: [
        ...MAPBOX_DEFAULT_STYLES,
        {
          id: 'custom-vertex',
          type: 'circle',
          filter: [
            'all',
            ['==', '$type', 'Point'],
            ['==', 'meta', 'vertex'],
            ['==', 'active', 'true'],
          ],
          paint: {
            'circle-radius': 16, // tamaño del vértice
            'circle-color': '#000000', // color de fondo (turquesa tipo Bulma)
            'circle-stroke-width': 3,
            'circle-stroke-color': '#ffffff', // borde oscuro
            'circle-stroke-opacity': 0.25,
            'circle-opacity': 0.25,
            'circle-translate': [0, 60],
          },
        },
      ],
    });

    drawRef.current = draw;
    if (!map.hasControl) map.addControl(draw);

    map.on('draw.create', onCreate);
    map.on('draw.update', onUpdate);
    map.on('draw.delete', onDelete);
    map.on('draw.modechange', (e: DrawModeChangeEvent) =>
      handleDrawMode(e.mode),
    );

    return draw;
  });

  useEffect(() => {
    control.set({
      type: 'FeatureCollection',
      features: polygons,
    });
  }, [polygons, polygonInDrawing]);

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
  storedPolygons?: PolygonFeature[];
  polygonInDrawing?: PolygonFeature | null;

  isPulverizacionDetail?: boolean;

  currentGeolocation?: Coordinada | { error: string };
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
  storedPolygons,

  isPulverizacionDetail,
  polygonInDrawing,

  currentGeolocation,
}: Props) {
  const [drawMode, setDrawMode] = useState<DrawMode | null>(null);
  const handleDrawMode = (value: DrawMode) => setDrawMode(value);

  const [currentGeoJSON, setCurrentGeoJSON] = useState<FeatureCollection>({
    type: 'FeatureCollection',
    features: [],
  });

  useEffect(() => {
    if (currentGeolocation) {
      if ('error' in currentGeolocation) return;

      setCurrentGeoJSON({
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [currentGeolocation.lng, currentGeolocation.lat],
            },
            properties: {},
          },
        ],
      });
    }
  }, [currentGeolocation]);

  const [geoJSON, setGeoJSON] = useState<FeatureCollection>({
    type: 'FeatureCollection',
    features: [],
  });

  const [textGeoJSON, setTextGeoJSON] = useState<FeatureCollection>({
    type: 'FeatureCollection',
    features: [],
  });

  const [storedGeoJSON, setStoredGeoJSON] = useState<FeatureCollection>({
    type: 'FeatureCollection',
    features: [],
  });

  const [storedTextGeoJSON, setStoredTextGeoJSON] = useState<FeatureCollection>(
    {
      type: 'FeatureCollection',
      features: [],
    },
  );

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
            nombre: item.properties.nombre,
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

  useEffect(() => {
    if (storedPolygons) {
      setStoredTextGeoJSON({
        type: 'FeatureCollection',
        features: storedPolygons.map((item) => {
          const centroide = calcularCentroide(item.geometry.coordinates[0]);
          return {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: centroide,
            },
            properties: {
              nombre: item.properties.nombre,
              description: item.properties.description,
              opacity: isPulverizacionDetail ? item.properties.opacity : 1,
            },
          };
        }),
      });

      setStoredGeoJSON({
        type: 'FeatureCollection',
        features: storedPolygons?.map((item) => {
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
    }
  }, [storedPolygons]);

  const isMobile = useIsMobile();

  return (
    <div
      className={cn(
        'pointer-events-auto relative z-10 h-full w-full overflow-hidden rounded-lg duration-200 ease-in-out',
        size ?? '!h-[40dvh]',
        className,
      )}
      data-vaul-no-drag
    >
      <Map
        initialViewState={{
          zoom: customZoom ?? 14,
          latitude:
            polygons?.[0]?.geometry?.coordinates?.[0]?.[0]?.[1] ||
            ((currentGeolocation as Coordinada)?.lat ?? -37.31587),
          longitude:
            polygons?.[0]?.geometry?.coordinates?.[0]?.[0]?.[0] ||
            ((currentGeolocation as Coordinada)?.lng ?? -59.98368),
        }}
        mapboxAccessToken={MAPBOX_TOKEN}
        mapStyle={MAP_STYLE}
        style={{ width: '100%', height: '100%' }}
        id='map-for-pdf'
        preserveDrawingBuffer
        dragPan
        touchZoomRotate
        touchPitch
        data-vaul-no-drag
      >
        {drawMode === 'draw_polygon' && (
          <div className='absolute z-[99999] ml-2 mt-2 flex w-fit items-center gap-2 rounded-md bg-green-800 px-2 py-1 drop-shadow-xl'>
            <p className='font-bold'>Modo dibujo activado</p>
            <Check size={16} />
          </div>
        )}
        {isMobile && drawMode === 'draw_polygon' && (
          <div className='absolute bottom-0 z-[99999] w-fit rounded-md bg-yellow-500 px-2 py-1 text-primary-foreground drop-shadow-xl'>
            <p className='font-bold'>
              Procurá marcar los puntos con un buen zoom ya que el tacto con el
              dedo es muy sensible y puede cerrarte el poligono a pesar de que
              no sea tu intención.
            </p>
          </div>
        )}
        {selectedCampo && <FlyTo selectedCampo={selectedCampo} />}
        {onCreate && onUpdate && onDelete && (
          <DrawControl
            onCreate={onCreate}
            onUpdate={onUpdate}
            onDelete={onDelete}
            polygons={polygons}
            polygonInDrawing={polygonInDrawing as PolygonFeature | null}
            handleDrawMode={handleDrawMode}
          />
        )}

        <Source id='stored-lotes-source' type='geojson' data={storedGeoJSON}>
          <Layer
            id='stored-borders-layer'
            type='line'
            paint={{
              'line-color': ['get', 'color'],
              'line-width': 4,
              'line-opacity': ['get', 'opacity'],
            }}
          />
          <Layer
            id='stored-lotes-layer'
            type='fill'
            paint={{
              'fill-color': ['get', 'color'],
              'fill-opacity': ['get', 'opacity'],
            }}
          />
        </Source>
        <Source
          id='stored-lotes-text-description-source'
          type='geojson'
          data={storedTextGeoJSON}
        >
          <Layer
            id='stored-lotes-description-text-layer'
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
        <Source
          id='current-geolocation-source'
          type='geojson'
          data={currentGeoJSON}
        >
          <Layer
            id='current-geolocation-layer'
            type='circle'
            paint={{
              'circle-color': '#0079FF',
              'circle-stroke-width': 2,
              'circle-stroke-color': '#FFFFFF',
            }}
          />
        </Source>
      </Map>
    </div>
  );
}
