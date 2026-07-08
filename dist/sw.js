const CACHE_NAME = "controle-financeiro-v1.0.0";
const OFFLINE_URL = "/offline.html";
const CACHE_FILES = [
    "/",
    "/index.html",
    "/manifest.json",
    "/offline.html",
    "/icons/icon-192.png",
    "/icons/icon-512.png"
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(CACHE_FILES))
            .then(() => self.skipWaiting())
    );

});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys()
            .then(keys =>
                Promise.all(
                    keys
                        .filter(key => key !== CACHE_NAME)
                        .map(key => caches.delete(key))
                )
            )
            .then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", (event) => {
    const url = new URL(event.request.url);

    if (url.hostname.includes("supabase")) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then(response => {
                const copy = response.clone();
                caches.open(CACHE_NAME)
                    .then(cache => cache.put(event.request, copy));
                return response;
            })

            .catch(() => {
                return caches.match(event.request)
                    .then(response => response || caches.match(OFFLINE_URL));
            })
    );
});