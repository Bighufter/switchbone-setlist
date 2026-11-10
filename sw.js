// AUTOMATISCH GEGENEREERD door scripts/build-sw.mjs. Niet met de hand aanpassen.
const VERSION = "22c7c86d8e";
const CACHE = "switchbone-setlist-" + VERSION;
const ASSETS = [
  "./",
  "assets/logo.png",
  "fonts/archivo-latin-wdth-normal.woff2",
  "icons/apple-touch-icon.png",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-maskable-512.png",
  "index.html",
  "manifest.webmanifest",
  "songs.json"
];

self.addEventListener("install", (event) => {
  // Alles vooraf opslaan, zodat de app daarna volledig offline werkt.
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith("switchbone-setlist-") && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// De pagina stuurt dit bericht als je op "Bijwerken" tikt.
self.addEventListener("message", (event) => {
  if (event.data === "skipWaiting") self.skipWaiting();
});

// Eerst uit de opslag op het apparaat, alleen als het daar niet staat via het netwerk.
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;
  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then((hit) => {
      if (hit) return hit;
      if (req.mode === "navigate") return caches.match("index.html").then((r) => r || fetch(req));
      return fetch(req);
    })
  );
});
