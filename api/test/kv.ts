import type { VercelRequest, VercelResponse } from '@vercel/node'
import { kv } from '@vercel/kv'

// GET - Test simple de connexion KV
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Test basique
    const testKey = `test:${Date.now()}`
    const testValue = 'test-value'
    
    await kv.set(testKey, testValue, { ex: 5 })
    const result = await kv.get<string>(testKey)
    
    return res.status(200).json({
      success: true,
      message: 'Vercel KV fonctionne',
      test: result === testValue ? 'OK' : 'FAIL',
      env: {
        hasKvUrl: !!process.env.KV_URL,
        hasKvRestApiUrl: !!process.env.KV_REST_API_URL,
        hasKvRestApiToken: !!process.env.KV_REST_API_TOKEN,
      }
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      env: {
        hasKvUrl: !!process.env.KV_URL,
        hasKvRestApiUrl: !!process.env.KV_REST_API_URL,
        hasKvRestApiToken: !!process.env.KV_REST_API_TOKEN,
      }
    })
  }
}

