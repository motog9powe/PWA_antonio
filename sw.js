const CACHE_NAME = "pwa-crud-cache-v1";
const urlsToCache = [
    "/PWA",
    "/index.html",
    "/styles.css",
    "/app.js",
    "/crud.php",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png"
];

// Instalación del Service Worker
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log("Archivos en caché");
            return cache.addAll(urlsToCache);
        })
    );
});

// Activación del Service Worker
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log("Caché antiguo eliminado");
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// Interceptar solicitudes de red
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});caches.open(CACHE_NAME).then(cache => {
    urlsToCache.forEach(async url => {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
            await cache.put(url, response);
        } catch (err) {
            console.error(`Error al cargar ${url}:`, err);
        }
    });
});
