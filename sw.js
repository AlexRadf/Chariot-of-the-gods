/* ============================================================
   CHARIOT OF THE GODS — offline service worker
   ------------------------------------------------------------
   Caches every page and asset so the whole prop kit loads and
   runs with no internet after the first visit — dice rolling,
   sheets, agenda, scanner, map, tracker, terminal, all of it.

   The only things that still need a connection are the
   cross-device features (rolls hopping between separate
   devices, and the self-destruct remote) which relay through
   ntfy.sh; those requests are left untouched here and simply
   fail gracefully when offline.

   Strategy:
     · navigations / HTML  -> network-first, fall back to cache
       (so you get fresh content online, cached copy offline)
     · same-origin assets  -> stale-while-revalidate: the cached copy
       comes back instantly, and a fresh one is fetched behind it for
       next time. These used to be cache-first, which meant an edit to
       gmdata.js or rollbus.js never reached a device that had already
       visited — the pages updated around them and the data didn't.
     · Google Fonts        -> cache-first (they never change)
   Bump CACHE to drop every old copy at once.
   ============================================================ */
const CACHE = "cotg-offline-v5";

/* Core files, relative to this worker's scope (the site root). */
const CORE = [
  "./",
  "./index.html",
  "./sheet/", "./sheet/index.html",
  "./display/", "./display/index.html",
  "./tracker/", "./tracker/index.html",
  "./map/", "./map/index.html", "./map/montero-deck-a.png",
  "./blueprint/", "./blueprint/index.html",
  "./scan/", "./scan/index.html",
  "./control/", "./control/index.html",
  "./cards/access-cards.html",
  "./assets/rollbus.js",
  "./assets/initiative.js",
  "./assets/gmdata.js",
  "./assets/deckplans.js",
  "./assets/jsqr.js"
];

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // add resiliently — one missing URL must not fail the whole install
    await Promise.all(CORE.map(u => cache.add(u).catch(() => {})));
    self.skipWaiting();
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

function stripQuery(url) {
  const u = new URL(url);
  u.search = "";
  u.hash = "";
  return u.toString();
}

const FONT_HOSTS = ["fonts.googleapis.com", "fonts.gstatic.com"];

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;                 // let ntfy POSTs pass through
  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;

  // Cross-origin: only handle Google Fonts (cache-first). Everything else
  // (e.g. the ntfy relay / EventSource) is left to the network untouched.
  if (!sameOrigin) {
    if (FONT_HOSTS.includes(url.hostname)) {
      event.respondWith(cacheFirst(req));
    }
    return;
  }

  // Same-origin navigations / HTML: network-first, fall back to cache.
  if (req.mode === "navigate" ||
      (req.headers.get("accept") || "").includes("text/html")) {
    event.respondWith(networkFirst(req));
    return;
  }

  // Same-origin assets: stale-while-revalidate.
  event.respondWith(staleWhileRevalidate(event, req));
});

/* Serve what we have, then quietly replace it. waitUntil keeps the worker
   alive for the background fetch, so the new copy is really in the cache
   before it shuts down. */
async function staleWhileRevalidate(event, req) {
  const cache = await caches.open(CACHE);
  const hit = await cache.match(req);
  const fresh = fetch(req).then(net => {
    if (net && (net.ok || net.type === "opaque")) cache.put(req, net.clone());
    return net;
  }).catch(() => null);
  if (hit) { event.waitUntil(fresh); return hit; }
  return (await fresh) || Response.error();
}

async function networkFirst(req) {
  const cache = await caches.open(CACHE);
  try {
    const net = await fetch(req);
    // cache a query-stripped copy so /?id=8654 and /sheet/?char=x work offline
    if (net && net.ok) cache.put(stripQuery(req.url), net.clone());
    return net;
  } catch (e) {
    return (await cache.match(stripQuery(req.url))) ||
           (await cache.match(req)) ||
           (await cache.match("./index.html")) ||
           (await cache.match("./")) ||
           Response.error();
  }
}

async function cacheFirst(req) {
  const cache = await caches.open(CACHE);
  const hit = await cache.match(req, { ignoreSearch: false });
  if (hit) return hit;
  try {
    const net = await fetch(req);
    if (net && (net.ok || net.type === "opaque")) cache.put(req, net.clone());
    return net;
  } catch (e) {
    return (await cache.match(req)) || Response.error();
  }
}
