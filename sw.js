// Bump VERSION on every change so phones pick up the new files.
const VERSION = 'ncm-mixes-v3';
const FILES = ['./', 'index.html', 'manifest.json', 'xlsx.full.min.js', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  // Mix data always comes from the network (the app keeps its own copy for offline use)
  if (new URL(e.request.url).pathname.endsWith('/data.enc')) return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(hit => hit || fetch(e.request)));
});
