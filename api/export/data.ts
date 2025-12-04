import type { VercelRequest, VercelResponse } from '@vercel/node'
import { kv } from '@vercel/kv'
// Types inline
interface UserProfile {
  id: string
  userId: string
  baseLanguage: string
  fields: any[]
  tags: string[]
  metadata: Record<string, any>
  createdAt: string
  updatedAt: string
}

// GET - Exporter toutes les données brutes de l'utilisateur
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const userId = req.headers['x-user-id'] as string
  if (!userId) {
    return res.status(401).json({ error: 'Non autorisé' })
  }

  try {
    const profile = await kv.get<UserProfile>(`profile:${userId}`)
    
    if (!profile) {
      return res.status(404).json({ error: 'Profil non trouvé' })
    }

    // Format d'export JSON complet
    const exportData = {
      userId,
      baseLanguage: profile.baseLanguage,
      exportedAt: new Date().toISOString(),
      fields: profile.fields,
      tags: profile.tags,
      metadata: profile.metadata,
    }

    // Retourner en JSON (peut être téléchargé)
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Content-Disposition', `attachment; filename="just1_export_${userId}_${Date.now()}.json"`)
    
    return res.status(200).json(exportData)
  } catch (error) {
    console.error('Export error:', error)
    return res.status(500).json({ error: 'Erreur lors de l\'export' })
  }
}

