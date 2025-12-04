import type { VercelRequest, VercelResponse } from '@vercel/node'
import { kv } from '@vercel/kv'

const DEEPL_API_KEY = process.env.DEEPL_API_KEY || ''
const DEEPL_API_URL = 'https://api-free.deepl.com/v2/translate'

// Fonction pour traduire un texte avec DeepL
async function translateText(text: string, targetLang: string, sourceLang?: string): Promise<string> {
  try {
    const response = await fetch(DEEPL_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        text: text,
        target_lang: targetLang.toUpperCase(),
        ...(sourceLang && { source_lang: sourceLang.toUpperCase() }),
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('DeepL API error:', error)
      throw new Error(`DeepL API error: ${response.status}`)
    }

    const data = await response.json()
    return data.translations[0]?.text || text
  } catch (error) {
    console.error('Translation error:', error)
    throw error
  }
}

// Mapping des codes de langue
const languageMapping: Record<string, string> = {
  'fr': 'FR',
  'en': 'EN',
  'es': 'ES',
  'de': 'DE',
  'it': 'IT',
  'pt': 'PT',
  'nl': 'NL',
  'pl': 'PL',
  'ru': 'RU',
  'ja': 'JA',
  'zh': 'ZH',
}

// POST - Traduction automatique d'un champ ou de tous les champs
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const userId = req.headers['x-user-id'] as string
  if (!userId) {
    return res.status(401).json({ error: 'Non autorisé' })
  }

  try {
    const { fieldId, targetLanguage, translateAll } = req.body

    if (!targetLanguage) {
      return res.status(400).json({ error: 'Langue cible requise' })
    }

    // Récupérer le profil
    const profile = await kv.get<any>(`profile:${userId}`)
    if (!profile) {
      return res.status(404).json({ error: 'Profil non trouvé' })
    }

    const targetLangCode = languageMapping[targetLanguage.toLowerCase()] || targetLanguage.toUpperCase()
    const sourceLangCode = languageMapping[profile.baseLanguage.toLowerCase()] || profile.baseLanguage.toUpperCase()

    if (translateAll) {
      // Traduire tous les champs vers la langue cible
      const translatedFields = await Promise.all(
        profile.fields.map(async (field: any) => {
          const baseValue = field.values.find((v: any) => v.language === profile.baseLanguage)
          if (!baseValue || !baseValue.value) return field

          // Vérifier si la traduction existe déjà
          const existingTranslation = field.values.find((v: any) => v.language === targetLanguage)
          if (existingTranslation && existingTranslation.value) {
            // La traduction existe déjà, on la garde
            return field
          }

          try {
            // Traduire avec DeepL
            const translatedText = await translateText(
              String(baseValue.value),
              targetLangCode,
              sourceLangCode
            )

            const translatedValue = {
              language: targetLanguage,
              value: translatedText,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }

            return {
              ...field,
              values: [...field.values, translatedValue],
            }
          } catch (error) {
            console.error(`Error translating field ${field.id}:`, error)
            // En cas d'erreur, on garde le champ tel quel
            return field
          }
        })
      )

      profile.fields = translatedFields
      profile.updatedAt = new Date().toISOString()
      await kv.set(`profile:${userId}`, profile)

      return res.status(200).json({
        success: true,
        message: `Tous les champs traduits en ${targetLanguage}`,
        profile,
      })
    } else if (fieldId) {
      // Traduire un champ spécifique
      const field = profile.fields.find((f: any) => f.id === fieldId)
      if (!field) {
        return res.status(404).json({ error: 'Champ non trouvé' })
      }

      const baseValue = field.values.find((v: any) => v.language === profile.baseLanguage)
      if (!baseValue || !baseValue.value) {
        return res.status(400).json({ error: 'Valeur de base non trouvée ou vide' })
      }

      try {
        // Traduire avec DeepL
        const translatedText = await translateText(
          String(baseValue.value),
          targetLangCode,
          sourceLangCode
        )

        const translatedValue = {
          language: targetLanguage,
          value: translatedText,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        const existingTranslation = field.values.find((v: any) => v.language === targetLanguage)
        if (existingTranslation) {
          field.values = field.values.map((v: any) =>
            v.language === targetLanguage ? translatedValue : v
          )
        } else {
          field.values.push(translatedValue)
        }

        profile.fields = profile.fields.map((f: any) => (f.id === fieldId ? field : f))
        profile.updatedAt = new Date().toISOString()
        await kv.set(`profile:${userId}`, profile)

        return res.status(200).json({
          success: true,
          message: `Champ traduit en ${targetLanguage}`,
          field,
        })
      } catch (error) {
        console.error('Translation error:', error)
        return res.status(500).json({ 
          error: 'Erreur lors de la traduction',
          details: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    } else {
      return res.status(400).json({ error: 'fieldId ou translateAll requis' })
    }
  } catch (error) {
    console.error('Translate error:', error)
    return res.status(500).json({ error: 'Erreur lors de la traduction' })
  }
}
