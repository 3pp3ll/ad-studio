/* Offline support for the installed app. Pages load from the network first so updates show up;
   files fall back to the saved copy when there is no connection. Bump VERSION after each release. */
const VERSION = 'studio-v3';
const FILES = ['./', 'index.html', 'manifest.webmanifest', 'css/style.css',
  'js/i18n.js', 'js/brand.js', 'js/state.js', 'js/storage.js', 'js/media.js', 'js/ai.js', 'js/views-user.js', 'js/views-admin.js', 'js/export.js', 'js/app.js',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png', 'icons/favicon-32.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET') return;
  const fonts = /fonts\.(googleapis|gstatic)\.com$/.test(u.hostname);
  if (u.origin !== location.origin && !fonts) return;
  e.respondWith(fetch(r).then(res => { if (res.ok || res.type === 'opaque') { const cp = res.clone(); caches.open(VERSION).then(c => c.put(r, cp)); } return res; })
    .catch(() => caches.match(r).then(m => m || (r.mode === 'navigate' ? caches.match('index.html') : Response.error()))));
});
