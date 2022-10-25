const STATIC_CACHE_NAME = 'static-cache-v1.2';
const INMUTABLE_CACHE_NAME = 'inmutable-cache-v1.1';
const DYNAMIC_CACHE_NAME = 'dynamic-cache-v1.1';


const cleanCache = (cacheName, limitItems) => {
  caches.open(cacheName).then((cache) => {
    return cache.keys().then((keys) => {
      if (keys.length > limitItems) {
        cache.delete(keys[0]).then(cleanCache(cacheName, limitItems));
      }
    });
  });
};


self.addEventListener('install', (event) => {
  const respCache = caches.open(STATIC_CACHE_NAME).then((cache) => {
    return cache.addAll([
      '/-pwa-gustavo/',
      '/-pwa-gustavo/index.html',
      '/-pwa-gustavo/images/icons/android-launchericon-72-72.png',
      '/-pwa-gustavo/images/icons/android-launchericon-96-96.png',
      '/-pwa-gustavo/images/icons/android-launchericon-144-144.png',
      '/-pwa-gustavo/images/icons/android-launchericon-192-192.png',
      '/-pwa-gustavo/images/icons/android-launchericon-512-512.png',
      '/-pwa-gustavo/manifest.json',
      '/-pwa-gustavo/pages/offline.html',
    ]);
  });
  const respCacheInmutable = caches.open(INMUTABLE_CACHE_NAME).then((cache) => {
    return cache.addAll([
      'https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css',
      'https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/js/bootstrap.bundle.min.js'
    ]);
  });

  event.waitUntil(Promise.all([respCache, respCacheInmutable]));
});


self.addEventListener('activate', (event) =>{
    const proDelete = caches.keys().then(cachesItems =>{

      cachesItems.forEach(element =>{
        if(element !== STATIC_CACHE_NAME && element.includes('static')){
          return caches.delete(element)
        }
      })

    })

    event.waitUntil(Promise.all([proDelete]));
})

self.addEventListener('fetch', (event) => {
  const resp = caches.match(event.request).then((respCache) => {
    if (respCache) {
      return respCache;
    }
    return fetch(event.request).then((respWeb) => {
      caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
        cache.put(event.request, respWeb);
        cleanCache(DYNAMIC_CACHE_NAME, 10);
      });
      return respWeb.clone();
    }).catch((err) => {
      if(event.request.headers.get('accept').includes('image/*')){
        return caches.match('/-pwa-gustavo/images/icons/android-launchericon-144-144.png')
      }

      if(event.request.headers.get('accept').includes('text/html')){
        return caches.match('/-pwa-gustavo/pages/offline.html')
      }
    
    });
  });
  event.respondWith(resp);
});


