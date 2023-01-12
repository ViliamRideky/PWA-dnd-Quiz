const cache_container = "static_v2";
const files = [
    "/",
    "./style.css",
    "./script.js",
    "./index.html"
]

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(cache_container)
            .then(cache => {
                cache.addAll(files)
            })
    )
})

self.addEventListener('activate', function (event) {
    console.log("service worker activated", event);
})

addEventListener('fetch', event => {
    event.respondWith(async function () {
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) return cachedResponse;
        return fetch(event.request);
    }());
});