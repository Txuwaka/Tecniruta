// Solo guarda la interfaz; nunca rutas, GPS, direcciones, tráfico ni claves de API externas.
const CACHE='tecni-ruta-shell-v15';
const ASSETS=['./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('tecni-ruta-shell-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',event=>{
 const request=event.request,url=new URL(request.url);
 if(request.method!=='GET'||url.origin!==self.location.origin)return;
 const shell=new URL('./index.html',self.registration.scope).href;
 if(request.mode==='navigate'&&url.pathname.startsWith(new URL(self.registration.scope).pathname)){
  event.respondWith(fetch(request).catch(async()=>await caches.match(shell)||new Response('Sin conexión. Vuelve a abrir Tecni Ruta cuando tengas internet.',{status:503,headers:{'Content-Type':'text/plain;charset=utf-8'}})));return;
 }
 if(ASSETS.some(path=>new URL(path,self.registration.scope).href===url.href))event.respondWith(fetch(request).catch(()=>caches.match(request)));
});
