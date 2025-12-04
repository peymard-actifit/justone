import type { VercelRequest, VercelResponse } from '@vercel/node'
import bcrypt from 'bcryptjs'
import { kvGet } from '../../src/lib/redis-client'

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
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ error: 'Identifiant et mot de passe requis' })
    }

    // Récupérer l'ID utilisateur par username
    const userId = await kvGet<string>(`user:username:${username}`)
    if (!userId) {
      return res.status(401).json({ error: 'Identifiant ou mot de passe incorrect' })
    }

    // Récupérer l'utilisateur
    const user = await kvGet<User>(`user:${userId}`)
    if (!user) {
      return res.status(401).json({ error: 'Identifiant ou mot de passe incorrect' })
    }

    // Vérifier le mot de passe
    const isValid = await bcrypt.compare(password, user.passwordHash)
    if (!isValid) {
      return res.status(401).json({ error: 'Identifiant ou mot de passe incorrect' })
    }

    // Retourner l'utilisateur sans le hash
    const { passwordHash, ...userWithoutPassword } = user
    void passwordHash

    return res.status(200).json({
      success: true,
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error('Login error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return res.status(500).json({ 
      error: 'Erreur serveur',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    })
  }
}

