const STATIC_CACHE_NAME = 'static-cache-v1.2';
const INMUTABLE_CACHE_NAME = 'inmutable-cache-v1.1';
const DYNAMIC_CACHE_NAME = 'dynamic-cache-v1.1';


self.addEventListener('install', (event) =>{
    console.log('SW: Instalado');
    const respCache = caches.open(STATIC_CACHE_NAME).then((cache)=>{
       return cache.addAll([
            '/-pwa-gustavo',
            '/-pwa-gustavo/index.html',
            '/-pwa-gustavo/https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css',
            '/-pwa-gustavo/https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/js/bootstrap.bundle.min.js',
            '/-pwa-gustavo/https://img.remediosdigitales.com/e997b7/ducati-panigale-v4-r-2019-005/840_560.jpg',
            '/-pwa-gustavo/https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css'
        ]);
    });


    event.waitUntil(respCache);
});

self.addEventListener('fetch', (event)=>{
    event.respondWith(
        caches.match(event.request)
        .then((response)=>{
          if(response){
            return response;
          }
          else{
            return fetch(event.request) // response of requests
            .then((res)=>{
              return caches.open(STATIC_CACHE_NAME) //create dynamic cache
              .then((cache)=>{
                cache.put(event.request.url,res.clone());
                return res;
              })
            })
          }
        })
        .catch(()=>{})
      )


})