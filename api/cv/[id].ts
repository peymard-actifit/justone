import type { VercelRequest, VercelResponse } from '@vercel/node'
import { kv } from '@vercel/kv'

interface CV {
  id: string
  userId: string
  name: string
  language: string
  createdAt: string
  updatedAt: string
  identity: object
  experiences: object[]
  education: object[]
  skills: object[]
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const userId = req.headers['x-user-id'] as string
  const { id: cvId } = req.query

  if (!userId) {
    return res.status(401).json({ error: 'Non autorisé' })
  }

  if (!cvId || typeof cvId !== 'string') {
    return res.status(400).json({ error: 'ID du CV requis' })
  }

  // GET - Récupérer un CV
  if (req.method === 'GET') {
    try {
      const cv = await kv.get<CV>(`cv:${cvId}`)

      if (!cv) {
        return res.status(404).json({ error: 'CV non trouvé' })
      }

      if (cv.userId !== userId) {
        return res.status(403).json({ error: 'Non autorisé' })
      }

      return res.status(200).json({ cv })
    } catch (error) {
      console.error('Get CV error:', error)
      return res.status(500).json({ error: 'Erreur serveur' })
    }
  }

  // PUT - Mettre à jour un CV
  if (req.method === 'PUT') {
    try {
      const cv = await kv.get<CV>(`cv:${cvId}`)

      if (!cv) {
        return res.status(404).json({ error: 'CV non trouvé' })
      }

      if (cv.userId !== userId) {
        return res.status(403).json({ error: 'Non autorisé' })
      }

      const updates = req.body
      const updatedCV = {
        ...cv,
        ...updates,
        id: cv.id,
        userId: cv.userId,
        updatedAt: new Date().toISOString(),
      }

      await kv.set(`cv:${cvId}`, updatedCV)

      return res.status(200).json({ success: true, cv: updatedCV })
    } catch (error) {
      console.error('Update CV error:', error)
      return res.status(500).json({ error: 'Erreur serveur' })
    }
  }

  // DELETE - Supprimer un CV
  if (req.method === 'DELETE') {
    try {
      const cv = await kv.get<CV>(`cv:${cvId}`)

      if (!cv) {
        return res.status(404).json({ error: 'CV non trouvé' })
      }

      if (cv.userId !== userId) {
        return res.status(403).json({ error: 'Non autorisé' })
      }

      await kv.del(`cv:${cvId}`)
      await kv.srem(`user:${userId}:cvs`, cvId)

      return res.status(200).json({ success: true })
    } catch (error) {
      console.error('Delete CV error:', error)
      return res.status(500).json({ error: 'Erreur serveur' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}

