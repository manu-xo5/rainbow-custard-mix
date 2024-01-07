import { sha256 } from '@/lib/utils'

export type CacheKeys = 'folder'

const cache = new Map<CacheKeys, string>()

export function isCached(Astro: any, cacheKey: CacheKeys) {
  const etag = cache.get(cacheKey)
  return Astro.request.headers.get('if-none-match') === etag
}

export function setCached(cacheKey: CacheKeys) {
  const etag = sha256()
  cache.set(cacheKey, etag)
}

export function updateCacheControl(Astro: any, cacheKey: CacheKeys) {
  if (!cache.has(cacheKey)) {
    setCached("folder")
  }
  
  const etag = cache.get(cacheKey)

  Astro.response.headers.set('cache-control', 'max-age=0')
  Astro.response.headers.set('etag', etag)
}
