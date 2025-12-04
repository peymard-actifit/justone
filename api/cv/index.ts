import type { VercelRequest, VercelResponse } from '@vercel/node'
import { kv } from '@vercel/kv'
import { v4 as uuidv4 } from 'uuid'

interface CV {
  id: string
  userId: string
  name: string
  language: string
  createdAt: string
  updatedAt: string
  identity: {
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  title?: string
  subtitle?: string
  summary?: string
  experiences: Array<{
    id: string
    company: string
    position: string
    startDate: string
    endDate?: string
    description: string
  }>
  education: Array<{
    id: string
    school: string
    degree: string
    field?: string
    endDate?: string
  }>
  skills: Array<{
    id: string
    name: string
    category?: string
  }>
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const userId = req.headers['x-user-id'] as string

  if (!userId) {
    return res.status(401).json({ error: 'Non autorisé' })
  }

  // GET - Liste des CV
  if (req.method === 'GET') {
    try {
      const cvIds = await kv.smembers<string[]>(`user:${userId}:cvs`)
      
      if (!cvIds || cvIds.length === 0) {
        return res.status(200).json({ cvs: [] })
      }

      const cvs = await Promise.all(
        cvIds.map(id => kv.get<CV>(`cv:${id}`))
      )

      const validCvs = cvs
        .filter((cv): cv is CV => cv !== null)
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

      return res.status(200).json({ cvs: validCvs })
    } catch (error) {
      console.error('Get CVs error:', error)
      return res.status(500).json({ error: 'Erreur serveur' })
    }
  }

  // POST - Créer un CV
  if (req.method === 'POST') {
    try {
      const { name, language = 'fr' } = req.body

      if (!name) {
        return res.status(400).json({ error: 'Le nom du CV est requis' })
      }

      const now = new Date().toISOString()
      const cv: CV = {
        id: uuidv4(),
        userId,
        name,
        language,
        createdAt: now,
        updatedAt: now,
        identity: {
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
        },
        experiences: [],
        education: [],
        skills: [],
      }

      await kv.set(`cv:${cv.id}`, cv)
      await kv.sadd(`user:${userId}:cvs`, cv.id)

      return res.status(200).json({ success: true, cv })
    } catch (error) {
      console.error('Create CV error:', error)
      return res.status(500).json({ error: 'Erreur serveur' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}

