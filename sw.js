const STATIC_CACHE_NAME = 'static-cache-v1.2';
const INMUTABLE_CACHE_NAME = 'inmutable-cache-v1.1';
const DYNAMIC_CACHE_NAME = 'dynamic-cache-v1.1';


self.addEventListener('install', (event) => {
  console.log('SW: Instalado');
  const respCache = caches.open(STATIC_CACHE_NAME).then((cache) => {
    return cache.addAll([
      '/-pwa-gustavo/',
      '/-pwa-gustavo/index.html',
      'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css',
      'https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/js/bootstrap.bundle.min.js',
      'https://img.remediosdigitales.com/e997b7/ducati-panigale-v4-r-2019-005/840_560.jpg',
      'https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css'
    ]);
  });


  event.waitUntil(respCache);
});

self.addEventListener('fetch', (event) => {



  event.respondWith(async () => {
    const cachedResponse = await caches.match(event.request);

    if (cachedResponse) {
      return cachedResponse
    } else {
      return fetch(event.request) // response of requests
        .then((res) => {
          return caches.open(STATIC_CACHE_NAME) //create dynamic cache
            .then((cache) => {
              cache.put(event.request.url, res.clone());
              return res;
            })
        })
    }
  })



})
