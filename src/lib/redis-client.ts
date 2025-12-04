// Client Redis compatible avec REDIS_URL
import Redis from 'ioredis'

let redisClient: Redis | null = null

export function getRedisClient(): Redis {
  if (!redisClient) {
    const redisUrl = process.env.REDIS_URL || process.env.KV_URL
    
    if (!redisUrl) {
      throw new Error('REDIS_URL or KV_URL environment variable is not set')
    }

    redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      lazyConnect: true,
    })
  }

  return redisClient
}

// Fonctions compatibles avec l'API @vercel/kv
export async function kvGet<T>(key: string): Promise<T | null> {
  const client = getRedisClient()
  const value = await client.get(key)
  return value ? JSON.parse(value) : null
}

export async function kvSet(key: string, value: any, options?: { ex?: number }): Promise<void> {
  const client = getRedisClient()
  const serialized = JSON.stringify(value)
  if (options?.ex) {
    await client.setex(key, options.ex, serialized)
  } else {
    await client.set(key, serialized)
  }
}

export async function kvDel(key: string): Promise<void> {
  const client = getRedisClient()
  await client.del(key)
}

export async function kvSadd(key: string, ...members: string[]): Promise<number> {
  const client = getRedisClient()
  return await client.sadd(key, ...members)
}

export async function kvSrem(key: string, ...members: string[]): Promise<number> {
  const client = getRedisClient()
  return await client.srem(key, ...members)
}

export async function kvSmembers<T>(key: string): Promise<T[]> {
  const client = getRedisClient()
  return await client.smembers(key) as T[]
}

