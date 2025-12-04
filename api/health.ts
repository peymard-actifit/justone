import type { VercelRequest, VercelResponse } from '@vercel/node'
import { kv } from '@vercel/kv'

// GET - Vérifier la connexion à Vercel KV
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Test de connexion simple
    const testKey = 'health:check'
    const testValue = Date.now().toString()
    
    await kv.set(testKey, testValue, { ex: 10 })
    const retrieved = await kv.get<string>(testKey)
    
    return res.status(200).json({
      success: true,
      message: 'Vercel KV est connecté',
      test: retrieved === testValue ? 'OK' : 'FAIL',
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
      env: {
        hasKvUrl: !!process.env.KV_URL,
        hasKvRestApiUrl: !!process.env.KV_REST_API_URL,
        hasKvRestApiToken: !!process.env.KV_REST_API_TOKEN,
      },
      hint: 'Vérifiez que la base Redis "just1" est connectée au projet sur Vercel'
    })
  }
}

