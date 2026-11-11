// AUTOMATISCH GEGENEREERD door scripts/build-sw.mjs. Niet met de hand aanpassen.
const VERSION = "c7e45f605a";
// Bouwtijd. GitHub Pages bewaart sw.js tot 10 minuten op verschillende servers; vlak na het
// publiceren kan een update-controle dus nog de vorige sw.js krijgen. Die zou het apparaat als
// "nieuwe versie" zien (tweede melding, en bij Bijwerken terug naar de oude). Daarom weigert
// een versie te installeren als er al een nieuwere op het apparaat staat.
const BUILT = 1794433380608;
const CACHE = "switchbone-setlist-" + BUILT + "-" + VERSION;
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
  // cache: "reload" slaat de browsercache over (GitHub Pages: max-age=600), anders kon een
  // nieuwe versie de oude index.html opslaan.
  event.waitUntil(
    caches.keys()
      .then((keys) => {
        const newer = keys.some((k) => { const m = k.match(/^switchbone-setlist-([0-9]+)-/); return m && +m[1] > BUILT; });
        if (newer) throw new Error("Ouder dan de versie op dit apparaat");
      })
      .then(() => caches.open(CACHE))
      .then((c) => c.addAll(ASSETS.map((u) => new Request(u, { cache: "reload" }))))
  );
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
  // ?fresh (Nieuwe nummers ophalen): eerst het netwerk, zonder internet de versie op het apparaat
  if (new URL(req.url).searchParams.has("fresh")) {
    event.respondWith(fetch(req, { cache: "no-store" }).catch(() => caches.match(req, { ignoreSearch: true })));
    return;
  }
  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then((hit) => {
      if (hit) return hit;
      if (req.mode === "navigate") return caches.match("index.html").then((r) => r || fetch(req));
      return fetch(req);
    })
  );
});
