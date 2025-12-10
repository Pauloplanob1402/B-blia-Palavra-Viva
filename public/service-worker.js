const CACHE_NAME = 'biblia-palavra-viva-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon.svg',
  '/offline.html' // Adicionando página de fallback (opcional)
];

// Instalação do Service Worker e cache de arquivos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching static assets');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Ativação do Service Worker, limpeza de caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Interceptação das requisições e lógica de cache
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Verifica se a requisição é para a API externa (ex: bible-api.com)
  if (url.hostname.includes('bible-api.com')) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          const fetchPromise = fetch(event.request).then((networkResponse) => {
            // Atualiza o cache com a resposta da rede
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
          // Retorna a resposta em cache ou faz a requisição à rede
          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // Lógica de cache para outras requisições (página estática e recursos)
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).catch(() => {
        // Página offline (opcional)
        if (event.request.mode === 'navigate') {
          return caches.match('/offline.html');
        }
      });
    })
  );
});

