import type { VercelRequest, VercelResponse } from '@vercel/node'
import { kv } from '@vercel/kv'

// GET - Vérifier la connexion à Vercel KV
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Test de connexion simple
    const testKey = 'health:check'
    const testValue = Date.now().toString()
    
    await kv.set(testKey, testValue, { ex: 10 }) // Expire après 10 secondes
    const retrieved = await kv.get<string>(testKey)
    
    if (retrieved === testValue) {
      return res.status(200).json({
        success: true,
        message: 'Vercel KV est connecté et fonctionne',
        timestamp: new Date().toISOString(),
      })
    } else {
      return res.status(500).json({
        success: false,
        error: 'Vercel KV répond mais les valeurs ne correspondent pas',
      })
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return res.status(500).json({
      success: false,
      error: 'Erreur de connexion à Vercel KV',
      details: errorMessage,
      hint: 'Vérifiez que la base Redis "just1" est bien connectée au projet sur Vercel',
    })
  }
}

