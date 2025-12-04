import type { VercelRequest, VercelResponse } from '@vercel/node'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { kvGet, kvSet } from '../../src/lib/redis-client'

interface User {
  id: string
  username: string
  passwordHash: string
  fullName: string
  email: string
  createdAt: string
  cvIds: string[]
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { username, password, fullName, email } = req.body

    if (!username || !password || !fullName || !email) {
      return res.status(400).json({ error: 'Tous les champs sont requis' })
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 6 caractères' })
    }

    // Vérifier si l'utilisateur existe
    const existingUserId = await kv.get<string>(`user:username:${username}`)
    if (existingUserId) {
      return res.status(400).json({ error: 'Cet identifiant est déjà utilisé' })
    }

    // Créer l'utilisateur
    const passwordHash = await bcrypt.hash(password, 12)
    const user: User = {
      id: uuidv4(),
      username,
      passwordHash,
      fullName,
      email,
      createdAt: new Date().toISOString(),
      cvIds: [],
    }

    // Sauvegarder dans Redis
    await kv.set(`user:${user.id}`, user)
    await kv.set(`user:username:${username}`, user.id)

    // Retourner l'utilisateur sans le hash
    const { passwordHash: _, ...userWithoutPassword } = user
    void _

    return res.status(200).json({
      success: true,
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error('Register error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorStack = error instanceof Error ? error.stack : undefined
    
    // Log détaillé pour Vercel
    console.error('Register error details:', {
      message: errorMessage,
      stack: errorStack,
      body: req.body,
      envCheck: {
        hasKvUrl: !!process.env.KV_URL,
        hasKvRestApiUrl: !!process.env.KV_REST_API_URL,
        hasKvRestApiToken: !!process.env.KV_REST_API_TOKEN,
        hasRedisUrl: !!process.env.REDIS_URL,
      }
    })
    
    return res.status(500).json({ 
      error: 'Erreur serveur',
      details: errorMessage,
      hint: 'Vérifiez que la base Redis "just1" est connectée au projet sur Vercel et redéployez'
    })
  }
}
