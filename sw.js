/**
 * Smart Coach - Service Worker (Offline Support for Gym & PWA)
 * Enables 100% offline functionality on GitHub Pages and smartphones
 */

const CACHE_NAME = 'smart-coach-v2.1';
const STATIC_ASSETS = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './manifest.json',
    './data/workouts.json',
    './views/login.html',
    './views/workout.html',
    './views/profile.html',
    './views/assessment.html',
    './icons/icon-192.png',
    './icons/icon-512.png',
    './icons/apple-touch-icon.png'
];

// 1. INSTALL: Cache all critical app assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[SW] Pre-caching static assets for offline workout...');
            return cache.addAll(STATIC_ASSETS);
        }).then(() => self.skipWaiting())
    );
});

// 2. ACTIVATE: Cleanup old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        console.log('[SW] Removing old cache:', key);
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// 3. FETCH: Stale-While-Revalidate for app assets, Network-only for cloud APIs
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Skip caching external cloud APIs (Google Apps Script and Gemini API)
    if (url.hostname.includes('script.google.com') || 
        url.hostname.includes('generativelanguage.googleapis.com')) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // Fetch fresh copy in background to update cache (Stale-While-Revalidate)
            const fetchPromise = fetch(event.request).then((networkResponse) => {
                if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return networkResponse;
            }).catch(() => {
                // Network failed (offline in gym)
                return cachedResponse;
            });

            // Return cached version immediately if available, otherwise wait for network
            return cachedResponse || fetchPromise;
        })
    );
});
