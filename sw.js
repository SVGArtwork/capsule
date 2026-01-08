const CACHE_NAME = 'capsule-v2';

const URLS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',

  // script
  './script/svg-pan-zoom.js',

  // icone (PWA)
  './icons/icon-192.png',
  './icons/icon-512.png',

  // fonts (se usate direttamente)
  './fonts/'
];

// INSTALL
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(URLS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// ACTIVATE
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

// FETCH
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
