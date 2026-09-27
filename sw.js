const CACHE = "waldhund-v5";
const CORE = ["./index.html","./styles.css","./app.js","./engine.js","./breeds.js","./manifest.json","./assets/icon.svg","./assets/hero.svg"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())
  );
});
self.addEventListener("fetch", e => {
  const url = e.request.url;
  // Netzwerk-first für Live-Daten (Wikipedia), Cache-first für App-Shell
  if (url.includes("wikipedia.org") || url.includes("duckduckgo")) {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
    return;
  }
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
