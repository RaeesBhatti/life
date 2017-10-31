(self => {
	'use strict'

	const siteHost = self.location.host,
				siteRoot = self.location.pathname.split('/').slice(0, -1).join('/')

	// Set a name for the current cache
	const cacheName = 'v1'

	// Default files to always cache
	const filesToCache = [
	]

	// Dont cache these files
	const cacheExemptFiles = [
	]

	self.addEventListener('install', e => {
		e.waitUntil(
			self.skipWaiting().then(() => {
				caches.open(cacheName).then(cache => {
					return cache.addAll(filesToCache)
				})
			})
		)
	})

	self.addEventListener('activate', e => {
		e.waitUntil(
			self.clients.claim().then(() => {
				caches.keys().then(cacheNames => {
					return Promise.all(cacheNames.map(thisCacheName => {
						if (thisCacheName !== cacheName) {
							return caches.delete(thisCacheName)
						}
					}))
				})
			})
		)
	})

	self.addEventListener('fetch', e => {
		let url = new URL(e.request.url)

		if ((url.protocol !== 'http:' && url.protocol !== 'https:') ||
				(url.host === siteHost && url.pathname.startsWith('/api/')) ||
				url.pathname.startsWith('/cdn-cgi/')
		) {
			return e.respondWith(fetch(e.request))
		}

		e.respondWith(
			caches.match(e.request).then(cachedResponse => {
				if (cachedResponse) {
					const cachedResponseClone = cachedResponse.clone()
					if (
						(cachedResponseClone.headers.get('etag') && cachedResponseClone.headers.get('etag').length) ||
						(cachedResponseClone.headers.get('last-modified') && cachedResponseClone.headers.get('last-modified').length)
					) {
						fetch(e.request.clone()).then(fetchResponse => {
							if (
								cachedResponseClone.headers.get('etag') !== fetchResponse.headers.get('etag') &&
								cachedResponseClone.headers.get('last-modified') !== fetchResponse.headers.get('last-modified')
							) {
								caches.open(cacheName).then(cache => {
									cache.put(e.request, fetchResponse)
								})
							}
						})
					}

					return cachedResponse
				}

				return fetch(e.request.clone()).then(fetchResponse => {
					if (!fetchResponse) {
						return new Response('No response from fetch')
					}

					if (
						!cacheExemptFiles.includes(e.request.url) &&
						parseInt(fetchResponse.headers.get('status')) < 400
					) {
						const fetchResponseClone = fetchResponse.clone()
						caches.open(cacheName).then(cache => {
							cache.put(e.request, fetchResponseClone)
						})
					}

					return fetchResponse
				}).catch(err => {
					console.log('[ServiceWorker] Error Fetching & Caching New Data', err)
				})
			})
		)
	})
})(self)
