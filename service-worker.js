const CACHE_NAME = 'weather-dashboard-v1'
const FILES = ['/', '/index.html']

self.addEventListener('install', (evt) => {
  evt.waitUntil(caches.open(CACHE_NAME).then((cache)=>cache.addAll(FILES)))
  self.skipWaiting()
})

self.addEventListener('fetch', (evt) => {
  evt.respondWith(caches.match(evt.request).then(r=>r||fetch(evt.request)))
})
