import type { CacheKeys } from '@/lib/cacheControl'
import crypto from 'crypto'

export function sha256(bytes?: crypto.BinaryLike) {
  const buffer = bytes || crypto.randomBytes(32)

  return crypto.createHash('sha256').update(buffer).digest('hex')
}

export const Http = {
  NotModified: new Response(null, { status: 304 }),

}
