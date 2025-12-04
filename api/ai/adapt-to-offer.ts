import type { VercelRequest, VercelResponse } from '@vercel/node'
import { kv } from '@vercel/kv'
import { callOpenAI } from './openai'

// POST - Adapter un CV à une offre d'emploi
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const userId = req.headers['x-user-id'] as string
  if (!userId) {
    return res.status(401).json({ error: 'Non autorisé' })
  }

  try {
    const { offerText, offerUrl } = req.body

    if (!offerText && !offerUrl) {
      return res.status(400).json({ error: 'Texte ou URL de l\'offre requis' })
    }

    const profile = await kv.get<any>(`profile:${userId}`)
    if (!profile) {
      return res.status(404).json({ error: 'Profil non trouvé' })
    }

    const cvContext = profile.fields
      .map((field: any) => {
        const baseValue = field.values.find((v: any) => v.language === profile.baseLanguage)
        return baseValue ? `${field.name}: ${baseValue.value}` : null
      })
      .filter(Boolean)
      .join('\n')

    const systemPrompt = `Tu es un expert en recrutement et en rédaction de CV. Tu dois adapter un CV existant à une offre d'emploi spécifique.

Analyse l'offre d'emploi et le CV, puis propose :
1. Les modifications à apporter au CV pour mieux correspondre à l'offre
2. Les mots-clés à ajouter
3. Les sections à mettre en avant
4. Les compétences à souligner
5. Un résumé adapté à l'offre

Retourne un JSON avec cette structure :
{
  "summary": "Résumé adapté à l'offre",
  "modifications": [
    {
      "field": "nom du champ",
      "suggestion": "nouvelle valeur suggérée",
      "reason": "raison de la modification"
    }
  ],
  "keywords": ["mot-clé 1", "mot-clé 2"],
  "highlightedSections": ["section 1", "section 2"]
}`

    const userPrompt = `Offre d'emploi :
${offerText || `URL: ${offerUrl}`}

CV actuel :
${cvContext}

Adapte ce CV à l'offre d'emploi.`

    const response = await callOpenAI([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ], 'gpt-4o-mini', 0.7)

    let adaptationData
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        adaptationData = JSON.parse(jsonMatch[0])
      } else {
        adaptationData = JSON.parse(response)
      }
    } catch (parseError) {
      adaptationData = {
        summary: response,
        modifications: [],
        keywords: [],
        highlightedSections: [],
      }
    }

    return res.status(200).json({
      success: true,
      adaptation: adaptationData,
      rawResponse: response,
    })
  } catch (error) {
    console.error('Adapt to offer error:', error)
    return res.status(500).json({
      error: 'Erreur lors de l\'adaptation du CV',
      details: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
