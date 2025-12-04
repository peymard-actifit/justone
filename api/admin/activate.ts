import type { VercelRequest, VercelResponse } from '@vercel/node'
import { kv } from '@vercel/kv'

const ADMIN_CODE = '12411241'

// POST - Activer le mode administrateur
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const userId = req.headers['x-user-id'] as string
  if (!userId) {
    return res.status(401).json({ error: 'Non autorisé' })
  }

  try {
    const { code } = req.body

    if (code !== ADMIN_CODE) {
      return res.status(403).json({ error: 'Code incorrect' })
    }

    // Activer le mode admin pour cette session
    await kv.set(`admin:${userId}`, {
      userId,
      isAdmin: true,
      activatedAt: new Date().toISOString(),
    }, { ex: 3600 }) // Expire après 1 heure

    return res.status(200).json({
      success: true,
      message: 'Mode administrateur activé',
    })
  } catch (error) {
    console.error('Admin activate error:', error)
    return res.status(500).json({ error: 'Erreur serveur' })
  }
}

