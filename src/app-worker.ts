import { CacheFirst, Serwist } from 'serwist';
import type { PrecacheEntry, RouteHandler, SerwistGlobalConfig } from 'serwist';

import { defaultCache } from '@serwist/next/worker';

// This declares the value of `injectionPoint` to TypeScript.
// `injectionPoint` is the string that will be replaced by the
// actual precache manifest. By default, this string is set to
// `"self.__SW_MANIFEST"`.
declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    {
      matcher: ({ request }) =>
        request.url.includes('api.mapbox.com') &&
        !request.url.includes('/styles'),
      handler: new CacheFirst({
        cacheName: 'mapbox-tiles',
        plugins: [
          {
            cacheWillUpdate: async ({ response }) => {
              return response &&
                (response.status === 200 || response.status === 0)
                ? response
                : null;
            },
          },
          {
            cacheDidUpdate: async ({ cacheName, request }) => {
              const cache = await caches.open(cacheName);
              const keys = await cache.keys();
              if (keys.length > 6000) {
                await cache.delete(keys[0]);
              }
            },
          },
        ],
        matchOptions: {
          ignoreSearch: true,
        },
      }),
      method: 'GET',
    },
    {
      matcher: ({ request }) => request.url.includes('api.mapbox.com/styles'),
      handler: new CacheFirst({
        cacheName: 'mapbox-styles',
        plugins: [
          {
            cacheWillUpdate: async ({ response }) => {
              return response &&
                (response.status === 200 || response.status === 0)
                ? response
                : null;
            },
          },
          {
            cacheDidUpdate: async ({ cacheName, request }) => {
              const cache = await caches.open(cacheName);
              const keys = await cache.keys();
              if (keys.length > 10) {
                await cache.delete(keys[0]);
              }
            },
          },
        ],
      }),
      method: 'GET',
    },
    ...defaultCache,
  ],
  fallbacks: {
    entries: [
      {
        url: '/offline', // the page that'll display if user goes offline
        matcher({ request }) {
          return request.destination === 'document';
        },
      },
    ],
  },
});

serwist.addEventListeners();
