import type { VercelRequest, VercelResponse } from '@vercel/node'
import { callOpenAI } from './openai'

// POST - Analyser un fichier CV avec OpenAI
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const userId = req.headers['x-user-id'] as string
  if (!userId) {
    return res.status(401).json({ error: 'Non autorisé' })
  }

  try {
    const { fileName, fileType, fileContent } = req.body

    if (!fileName || !fileType || !fileContent) {
      return res.status(400).json({ error: 'Nom, type et contenu du fichier requis' })
    }

    const systemPrompt = `Tu es un expert en analyse de CV. Tu dois extraire toutes les informations pertinentes d'un CV et les structurer en JSON.

Retourne un JSON avec cette structure :
{
  "fields": [
    {
      "tag": "nom",
      "name": "Nom",
      "type": "text",
      "value": "valeur extraite"
    },
    {
      "tag": "prenom",
      "name": "Prénom",
      "type": "text",
      "value": "valeur extraite"
    },
    {
      "tag": "email",
      "name": "Email",
      "type": "email",
      "value": "valeur extraite"
    },
    {
      "tag": "telephone",
      "name": "Téléphone",
      "type": "phone",
      "value": "valeur extraite"
    },
    {
      "tag": "adresse",
      "name": "Adresse",
      "type": "text",
      "value": "valeur extraite"
    },
    {
      "tag": "experiences",
      "name": "Expériences professionnelles",
      "type": "rich-text",
      "value": "liste détaillée des expériences"
    },
    {
      "tag": "formations",
      "name": "Formations",
      "type": "rich-text",
      "value": "liste des formations"
    },
    {
      "tag": "competences",
      "name": "Compétences",
      "type": "rich-text",
      "value": "liste des compétences"
    }
  ]
}

Extrais toutes les informations possibles du CV. Si une information n'est pas présente, laisse la valeur vide.`

    const userPrompt = `Analyse ce CV (format: ${fileType}, nom: ${fileName}) et extrais toutes les informations :

${fileContent.substring(0, 15000)}`

    const response = await callOpenAI([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ], 'gpt-4o-mini', 0.3)

    let analyzedData
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        analyzedData = JSON.parse(jsonMatch[0])
      } else {
        analyzedData = JSON.parse(response)
      }
    } catch (parseError) {
      analyzedData = {
        fields: [],
        extractedText: response,
      }
    }

    return res.status(200).json({
      success: true,
      data: analyzedData,
      message: 'Fichier analysé avec succès par OpenAI',
    })
  } catch (error) {
    console.error('Analyze file error:', error)
    return res.status(500).json({
      error: 'Erreur lors de l\'analyse',
      details: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
