import type { VercelRequest, VercelResponse } from '@vercel/node'
import { kv } from '@vercel/kv'
import { callOpenAI } from './openai'

// POST - Améliorer le contenu d'un champ avec IA
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const userId = req.headers['x-user-id'] as string
  if (!userId) {
    return res.status(401).json({ error: 'Non autorisé' })
  }

  try {
    const { fieldId, currentValue, fieldType, generateVersions = 3 } = req.body

    if (!fieldId || !currentValue) {
      return res.status(400).json({ error: 'fieldId et currentValue requis' })
    }

    const profile = await kv.get<any>(`profile:${userId}`)
    if (!profile) {
      return res.status(404).json({ error: 'Profil non trouvé' })
    }

    const field = profile.fields.find((f: any) => f.id === fieldId)
    if (!field) {
      return res.status(404).json({ error: 'Champ non trouvé' })
    }

    const systemPrompt = `Tu es un expert en rédaction professionnelle. Tu dois améliorer et proposer plusieurs versions d'un texte pour un CV.

Pour chaque version, propose une formulation plus professionnelle, impactante et pertinente, adaptée au contexte d'un CV de dirigeant ou manager.

Retourne un JSON avec cette structure :
{
  "versions": [
    {
      "version": 1,
      "text": "version améliorée 1",
      "improvements": ["amélioration 1", "amélioration 2"]
    },
    {
      "version": 2,
      "text": "version améliorée 2",
      "improvements": ["amélioration 1", "amélioration 2"]
    },
    {
      "version": 3,
      "text": "version améliorée 3",
      "improvements": ["amélioration 1", "amélioration 2"]
    }
  ]
}`

    const userPrompt = `Améliore ce texte pour un CV (type de champ: ${fieldType}, nom: ${field.name}) :

${currentValue}

Propose ${generateVersions} versions améliorées, chacune avec un style différent (professionnel, impactant, concis).`

    const response = await callOpenAI([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ], 'gpt-4o-mini', 0.8)

    let improvements
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        improvements = JSON.parse(jsonMatch[0])
      } else {
        improvements = JSON.parse(response)
      }
    } catch (parseError) {
      improvements = {
        versions: [
          { version: 1, text: response, improvements: ['Version améliorée par IA'] },
        ],
      }
    }

    if (improvements.versions && improvements.versions.length > 3) {
      improvements.versions = improvements.versions.slice(0, 3)
    }

    return res.status(200).json({
      success: true,
      improvements,
      fieldId,
    })
  } catch (error) {
    console.error('Improve content error:', error)
    return res.status(500).json({
      error: 'Erreur lors de l\'amélioration du contenu',
      details: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
