// Nome della cache (cambia la versione se aggiorni i file)
const CACHE_NAME = 'capsule-v1';

// File da mettere in cache SUBITO all'installazione
const URLS_TO_CACHE = [
  //'/',                        // La tua pagina index.html la commentiamo in fase di sviluppo 
  // Aggiungi qui altri file LOCALI se necessario, ad esempio:
  '/script/svg-pan-zoom.js',
];

// === INSTALLAZIONE: mette in cache i file essenziali ===
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Cache aperta:', CACHE_NAME);
        return cache.addAll(URLS_TO_CACHE);
      })
      .then(() => {
        console.log('[Service Worker] Installazione completata.');
        return self.skipWaiting(); // Forza l'attivazione immediata
      })
  );
});

// === ATTIVAZIONE: pulisce cache vecchie ===
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Rimuovo cache vecchia:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[Service Worker] Attivazione completata. Pronto a gestire fetch.');
      return self.clients.claim(); // Prende il controllo di tutte le pagine
    })
  );
});

// === FETCH: gestisce tutte le richieste di rete ===
self.addEventListener('fetch', event => {
  // Rispondi con la versione in cache se disponibile, altrimenti vai in rete
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          console.log('[Service Worker] Rispondo dalla cache:', event.request.url);
          return response;
        }
        // Altrimenti, vai in rete
        console.log('[Service Worker] Scarico dalla rete:', event.request.url);
        return fetch(event.request);
      })
  );
});