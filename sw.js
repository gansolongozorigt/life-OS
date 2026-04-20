// Сануулга өгөх функц
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(clients.openWindow('/'));
});

// Ус уух сануулга (Туршилтын байдлаар)
self.addEventListener('message', (event) => {
    if (event.data.action === 'water-reminder') {
        self.registration.showNotification('Ус уух цаг!', {
            body: 'Эрүүл мэнддээ анхаарч 250мл ус уугаарай.',
            icon: '/icon-192.png',
            badge: '/icon-192.png'
        });
    }
});
