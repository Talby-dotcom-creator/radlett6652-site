// sw.js
const CACHE_NAME = 'radlett-lodge-v1';
const STATIC_CACHE_NAME = 'radlett-lodge-static-v1';

// Only cache real, deployed assets. (In prod, Vite serves hashed files from /assets)
const urlsToCache = [
  '/',
  '/index.html',
  // You can leave fonts out to avoid opaque responses, or keep them if you want:
  'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600&family=Playfair+Display:wght@400;600;700&display=swap'
];

// Install: warm the cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// Activate: cleanup old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names.map((name) => {
          if (name !== CACHE_NAME && name !== STATIC_CACHE_NAME) {
            return caches.delete(name);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch: cache-first for static assets, network for everything else
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Only handle GET
  if (req.method !== 'GET') return;

  // Ignore unsupported schemes (fixes the chrome-extension error)
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

  // Optional: ignore cross-origin if you only want to cache same-origin
  // if (url.origin !== self.location.origin) return;

  // Only treat obvious static files as cacheable
  if (!isStaticAsset(url.pathname)) return;

  event.respondWith(handleStaticAsset(req));
});

function isStaticAsset(pathname) {
  return (
    /^\/assets\//.test(pathname) ||                // Vite build output
    /\.(js|css|png|jpg|jpeg|gif|svg|woff2?|ttf|eot|ico)$/.test(pathname) ||
    pathname === '/' ||
    pathname === '/index.html'
  );
}

async function handleStaticAsset(request) {
  const cache = await caches.open(STATIC_CACHE_NAME);
  const cached = await cache.match(request);
  if (cached) return cached;

  try {
    const resp = await fetch(request);
    // only cache successful, basic/opaque/cors GETs
    if (resp && resp.ok) {
      try {
        await cache.put(request, resp.clone());
      } catch (_) {
        // ignore cache put failures
      }
    }
    return resp;
  } catch (err) {
    // Optionally fall back to cache on network failure
    const fallback = await cache.match(request);
    if (fallback) return fallback;
    throw err;
  }
}
