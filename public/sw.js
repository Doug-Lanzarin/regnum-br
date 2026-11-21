// Service worker mínimo: permite mostrar notificações (obrigatório no iPhone)
// e abrir o site ao tocar no aviso. Não guarda cache, para os dados estarem sempre atualizados.
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()))

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      const open = list.find((c) => 'focus' in c)
      return open ? open.focus() : self.clients.openWindow('./')
    }),
  )
})
