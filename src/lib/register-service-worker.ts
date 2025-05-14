import { Workbox } from 'workbox-window';

export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      const wb = new Workbox('/sw.js');
      await wb.register();
      console.log('Service Worker registrado');
    });
  }
}
