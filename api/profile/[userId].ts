import type { VercelRequest, VercelResponse } from '@vercel/node'
import { kv } from '@vercel/kv'
// Types inline
interface FieldValue {
  language: string
  value: string | number | null
  aiVersions?: string[]
  createdAt: string
  updatedAt: string
}

interface DataField {
  id: string
  tag: string
  name: string
  type: string
  baseLanguage: string
  values: FieldValue[]
  metadata?: Record<string, any>
  createdAt: string
  updatedAt: string
}

interface UserProfile {
  id: string
  userId: string
  baseLanguage: string
  fields: DataField[]
  tags: string[]
  metadata: Record<string, any>
  createdAt: string
  updatedAt: string
}

const ADMIN_CODE = '12411241'

// GET - Récupérer le profil utilisateur
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { userId } = req.query

  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ error: 'User ID requis' })
  }

  // Vérifier l'authentification
  const authUserId = req.headers['x-user-id'] as string
  if (!authUserId || authUserId !== userId) {
    return res.status(401).json({ error: 'Non autorisé' })
  }

  if (req.method === 'GET') {
    try {
      const profile = await kv.get<UserProfile>(`profile:${userId}`)
      
      if (!profile) {
        // Créer un profil par défaut
        const defaultProfile: UserProfile = {
          id: `profile_${userId}`,
          userId,
          baseLanguage: 'fr',
          fields: [],
          tags: [],
          metadata: {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        
        await kv.set(`profile:${userId}`, defaultProfile)
        return res.status(200).json({ profile: defaultProfile })
      }

      return res.status(200).json({ profile })
    } catch (error) {
      console.error('Get profile error:', error)
      return res.status(500).json({ error: 'Erreur serveur' })
    }
  }

  // PUT - Mettre à jour le profil
  if (req.method === 'PUT') {
    try {
      const updates = req.body as Partial<UserProfile>
      
      const existingProfile = await kv.get<UserProfile>(`profile:${userId}`)
      if (!existingProfile) {
        return res.status(404).json({ error: 'Profil non trouvé' })
      }

      const updatedProfile: UserProfile = {
        ...existingProfile,
        ...updates,
        id: existingProfile.id, // Ne pas changer l'ID
        userId: existingProfile.userId, // Ne pas changer le userId
        updatedAt: new Date().toISOString(),
      }

      await kv.set(`profile:${userId}`, updatedProfile)
      return res.status(200).json({ profile: updatedProfile })
    } catch (error) {
      console.error('Update profile error:', error)
      return res.status(500).json({ error: 'Erreur serveur' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}

