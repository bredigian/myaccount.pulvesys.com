import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';

import { registerRoute } from 'workbox-routing';

// Cachear páginas (HTML) con StaleWhileRevalidate
registerRoute(
  ({ request }) => request.mode === 'navigate',
  new StaleWhileRevalidate({
    cacheName: 'pages',
  }),
);

// Cachear assets estáticos de Next.js (/_next/static/*) con CacheFirst
registerRoute(
  ({ url }) => url.pathname.startsWith('/_next/static/'),
  new CacheFirst({
    cacheName: 'next-static',
  }),
);

// Cachear otros assets (CSS, JS, imágenes) que no estén en _next/static
registerRoute(
  ({ request }) =>
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'image',
  new CacheFirst({
    cacheName: 'static-assets',
  }),
);

// Cachear tiles de MapBox
registerRoute(
  ({ url }) => url.href.includes('api.mapbox.com'),
  new CacheFirst({
    cacheName: 'mapbox-tiles',
    plugins: [
      {
        cacheWillUpdate: async ({ response }) => {
          if (response && response.status === 200) {
            return response;
          }
          return null;
        },
      },
    ],
  }),
);

// Manejar la instalación del Service Worker
self.addEventListener('install', () => {
  self.skipWaiting();
});

// Activar el Service Worker y limpiar caches antiguos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      // Limpiar caches antiguos para evitar acumulación
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (
              cacheName !== 'pages' &&
              cacheName !== 'next-static' &&
              cacheName !== 'static-assets' &&
              cacheName !== 'mapbox-tiles'
            ) {
              return caches.delete(cacheName);
            }
          }),
        );
      }),
    ]),
  );
});
