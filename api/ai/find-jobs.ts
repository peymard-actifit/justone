import type { VercelRequest, VercelResponse } from '@vercel/node'
import { kv } from '@vercel/kv'
import { callOpenAI } from './openai'

// POST - Rechercher des offres d'emploi correspondant au profil
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const userId = req.headers['x-user-id'] as string
  if (!userId) {
    return res.status(401).json({ error: 'Non autorisé' })
  }

  try {
    const { jobTitle, location, sector } = req.body

    const profile = await kv.get<any>(`profile:${userId}`)
    if (!profile) {
      return res.status(404).json({ error: 'Profil non trouvé' })
    }

    const profileContext = profile.fields
      .map((field: any) => {
        const baseValue = field.values.find((v: any) => v.language === profile.baseLanguage)
        return baseValue ? `${field.name}: ${baseValue.value}` : null
      })
      .filter(Boolean)
      .join('\n')

    const systemPrompt = `Tu es un expert en recherche d'emploi. Analyse un profil professionnel et propose des critères de recherche d'offres d'emploi pertinents.

Retourne un JSON avec :
{
  "searchCriteria": {
    "jobTitles": ["titre 1", "titre 2"],
    "keywords": ["mot-clé 1", "mot-clé 2"],
    "sectors": ["secteur 1", "secteur 2"],
    "locations": ["lieu 1", "lieu 2"]
  },
  "suggestions": [
    {
      "title": "Titre de poste suggéré",
      "description": "Description",
      "whyRelevant": "Pourquoi c'est pertinent"
    }
  ],
  "searchQueries": [
    "requête de recherche 1",
    "requête de recherche 2"
  ]
}`

    const userPrompt = `Profil professionnel :
${profileContext}

${jobTitle ? `Poste recherché : ${jobTitle}` : ''}
${location ? `Localisation : ${location}` : ''}
${sector ? `Secteur : ${sector}` : ''}

Propose des critères de recherche et des suggestions d'offres d'emploi pertinentes.`

    const response = await callOpenAI([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ], 'gpt-4o-mini', 0.7)

    let searchData
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        searchData = JSON.parse(jsonMatch[0])
      } else {
        searchData = JSON.parse(response)
      }
    } catch (parseError) {
      searchData = {
        searchCriteria: {},
        suggestions: [],
        searchQueries: [],
      }
    }

    return res.status(200).json({
      success: true,
      searchData,
      rawResponse: response,
    })
  } catch (error) {
    console.error('Find jobs error:', error)
    return res.status(500).json({
      error: 'Erreur lors de la recherche d\'offres',
      details: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
