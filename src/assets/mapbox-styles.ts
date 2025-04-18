enum COLORS {
  BLUE = '#3bb2d0',
  ORANGE = '#fbb03b',
  WHITE = '#fff',
}

export const MAPBOX_DEFAULT_STYLES = [
  {
    id: 'gl-draw-polygon-fill',
    type: 'fill',
    filter: ['all', ['==', '$type', 'Polygon']],
    paint: {
      'fill-color': [
        'case',
        ['==', ['get', 'active'], 'true'],
        COLORS.ORANGE,
        COLORS.BLUE,
      ],
      'fill-opacity': 0.1,
    },
  },

  {
    id: 'gl-draw-lines',
    type: 'line',
    filter: ['any', ['==', '$type', 'LineString'], ['==', '$type', 'Polygon']],
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    paint: {
      'line-color': [
        'case',
        ['==', ['get', 'active'], 'true'],
        COLORS.ORANGE,
        COLORS.BLUE,
      ],
      'line-dasharray': [
        'case',
        ['==', ['get', 'active'], 'true'],
        [0.2, 2],
        [2, 0],
      ],
      'line-width': 2,
    },
  },

  {
    id: 'gl-draw-point-outer',
    type: 'circle',
    filter: ['all', ['==', '$type', 'Point'], ['==', 'meta', 'feature']],
    paint: {
      'circle-radius': ['case', ['==', ['get', 'active'], 'true'], 7, 5],
      'circle-color': COLORS.WHITE,
    },
  },
  {
    id: 'gl-draw-point-inner',
    type: 'circle',
    filter: ['all', ['==', '$type', 'Point'], ['==', 'meta', 'feature']],
    paint: {
      'circle-radius': ['case', ['==', ['get', 'active'], 'true'], 5, 3],
      'circle-color': [
        'case',
        ['==', ['get', 'active'], 'true'],
        COLORS.ORANGE,
        COLORS.BLUE,
      ],
    },
  },

  {
    id: 'gl-draw-vertex-outer',
    type: 'circle',
    filter: [
      'all',
      ['==', '$type', 'Point'],
      ['==', 'meta', 'vertex'],
      ['!=', 'mode', 'simple_select'],
    ],
    paint: {
      'circle-radius': ['case', ['==', ['get', 'active'], 'true'], 7, 5],
      'circle-color': COLORS.WHITE,
    },
  },
  {
    id: 'gl-draw-vertex-inner',
    type: 'circle',
    filter: [
      'all',
      ['==', '$type', 'Point'],
      ['==', 'meta', 'vertex'],
      ['!=', 'mode', 'simple_select'],
    ],
    paint: {
      'circle-radius': ['case', ['==', ['get', 'active'], 'true'], 5, 3],
      'circle-color': COLORS.ORANGE,
    },
  },

  {
    id: 'gl-draw-midpoint',
    type: 'circle',
    filter: ['all', ['==', 'meta', 'midpoint']],
    paint: {
      'circle-radius': 3,
      'circle-color': COLORS.ORANGE,
    },
  },
];
