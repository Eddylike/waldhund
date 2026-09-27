const CACHE = "waldhund-v4";
const CORE = ["./index.html","./styles.css","./app.js","./engine.js","./breeds.js","./manifest.json","./assets/icon.svg","./assets/hero.svg"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
