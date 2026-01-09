/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const CACHE_NAME = 'flashfusion-core-v5.0';
const STATIC_CACHE = 'flashfusion-static-v5.0';
const ASSET_CACHE = 'flashfusion-assets-v5.0';

// Critical UI files for the App Shell
// Fixed: Using relative paths for better reliability in sandboxed/proxied environments
const APP_SHELL = [
  './',
  './index.html',
  './index.tsx',
  './App.tsx',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[SW] Pre-caching App Shell');
      return cache.addAll(APP_SHELL);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.map((key) => {
        if (![CACHE_NAME, STATIC_CACHE, ASSET_CACHE].includes(key)) {
          console.log('[SW] Clearing legacy cache:', key);
          return caches.delete(key);
        }
      })
    ))
  );
  self.clients.claim();
});

/**
 * Enhanced Fetch Orchestration
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  let url;

  try {
    url = new URL(request.url);
  } catch (e) {
    // Fallback for requests with non-standard URLs (e.g. data:, blob:, or extension schemes)
    // These should not be intercepted by the service worker logic below.
    return;
  }

  // 1. Federated AI Strategy: Network-First
  // Ensures fresh architectural analysis when online, fails gracefully when isolated.
  if (url.hostname.includes('googleapis') || url.pathname.includes('/api/')) {
    event.respondWith(
      fetch(request).catch(async () => {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) return cachedResponse;
        
        return new Response(JSON.stringify({
          status: "isolated",
          message: "Neural link severed. Operating in local-fallback mode."
        }), { headers: { 'Content-Type': 'application/json' } });
      })
    );
    return;
  }

  // 2. Heavy 3D Assets & Fonts: Cache-First
  // Three.js models, Environment maps, and Google Fonts don't change often.
  if (
    url.hostname.includes('fonts.gstatic.com') || 
    url.pathname.includes('.woff') || 
    url.pathname.includes('.glb') || 
    url.pathname.includes('.hdr')
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        return cached || fetch(request).then((response) => {
          const copy = response.clone();
          caches.open(ASSET_CACHE).then(cache => cache.put(request, copy));
          return response;
        });
      })
    );
    return;
  }

  // 3. UI Components & Logic: Stale-While-Revalidate
  // Serve the UI immediately, then update the cache in the background.
  event.respondWith(
    caches.match(request).then((cached) => {
      const networkFetch = fetch(request).then((response) => {
        if (response && response.status === 200) {
          const copy = response.clone();
          caches.open(STATIC_CACHE).then(cache => cache.put(request, copy));
        }
        return response;
      });
      return cached || networkFetch;
    })
  );
});