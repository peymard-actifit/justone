import type { VercelRequest, VercelResponse } from '@vercel/node'
import { kv } from '@vercel/kv'
// Types inline
interface CVFormat {
  id: string
  name: string
  description?: string
  templateFile?: string
  tags: string[]
  metadata: {
    country?: string[]
    targetAudience?: string[]
    category?: string
    [key: string]: any
  }
  createdBy?: string
  createdAt: string
  updatedAt: string
}

// GET - Liste des formats de CV
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    try {
      // Récupérer tous les formats (publics)
      const formatIds = await kv.smembers<string[]>('formats:list')
      
      if (!formatIds || formatIds.length === 0) {
        return res.status(200).json({ formats: [] })
      }

      const formats = await Promise.all(
        formatIds.map(id => kv.get<CVFormat>(`format:${id}`))
      )

      const validFormats = formats.filter((f): f is CVFormat => f !== null)

      // Appliquer les filtres si présents
      const { country, targetAudience, search } = req.query
      let filteredFormats = validFormats

      if (country && typeof country === 'string') {
        filteredFormats = filteredFormats.filter(f => 
          f.metadata.country?.includes(country)
        )
      }

      if (targetAudience && typeof targetAudience === 'string') {
        filteredFormats = filteredFormats.filter(f =>
          f.metadata.targetAudience?.includes(targetAudience)
        )
      }

      if (search && typeof search === 'string') {
        const searchLower = search.toLowerCase()
        filteredFormats = filteredFormats.filter(f =>
          f.name.toLowerCase().includes(searchLower) ||
          f.description?.toLowerCase().includes(searchLower)
        )
      }

      return res.status(200).json({ formats: filteredFormats })
    } catch (error) {
      console.error('Get formats error:', error)
      return res.status(500).json({ error: 'Erreur serveur' })
    }
  }

  // POST - Créer un format (Admin uniquement)
  if (req.method === 'POST') {
    const userId = req.headers['x-user-id'] as string
    const isAdmin = req.headers['x-is-admin'] === 'true'

    if (!userId || !isAdmin) {
      return res.status(403).json({ error: 'Admin uniquement' })
    }

    try {
      const formatData = req.body as Partial<CVFormat>

      if (!formatData.name || !formatData.tags) {
        return res.status(400).json({ error: 'Nom et tags requis' })
      }

      const format: CVFormat = {
        id: `format_${Date.now()}`,
        name: formatData.name,
        description: formatData.description,
        tags: formatData.tags,
        metadata: formatData.metadata || {},
        createdBy: userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      await kv.set(`format:${format.id}`, format)
      await kv.sadd('formats:list', format.id)

      return res.status(200).json({ success: true, format })
    } catch (error) {
      console.error('Create format error:', error)
      return res.status(500).json({ error: 'Erreur serveur' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}

