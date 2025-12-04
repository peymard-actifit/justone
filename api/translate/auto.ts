import type { VercelRequest, VercelResponse } from '@vercel/node'
import { kv } from '@vercel/kv'

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

    // Récupérer le profil
    const profile = await kv.get<any>(`profile:${userId}`)
    if (!profile) {
      return res.status(404).json({ error: 'Profil non trouvé' })
    }

    // TODO: Intégrer l'API de traduction (DeepL, Google Translate, etc.)
    // Pour l'instant, simulation
    
    if (translateAll) {
      // Traduire tous les champs vers la langue cible
      const translatedFields = profile.fields.map((field: any) => {
        const baseValue = field.values.find((v: any) => v.language === profile.baseLanguage)
        if (!baseValue) return field

        // Simuler la traduction
        const translatedValue = {
          language: targetLanguage,
          value: `[Traduit] ${baseValue.value}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        // Vérifier si la traduction existe déjà
        const existingTranslation = field.values.find((v: any) => v.language === targetLanguage)
        if (existingTranslation) {
          return {
            ...field,
            values: field.values.map((v: any) =>
              v.language === targetLanguage ? translatedValue : v
            ),
          }
        }

        return {
          ...field,
          values: [...field.values, translatedValue],
        }
      })

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
      if (!baseValue) {
        return res.status(400).json({ error: 'Valeur de base non trouvée' })
      }

      // Simuler la traduction
      const translatedValue = {
        language: targetLanguage,
        value: `[Traduit] ${baseValue.value}`,
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
    } else {
      return res.status(400).json({ error: 'fieldId ou translateAll requis' })
    }
  } catch (error) {
    console.error('Translate error:', error)
    return res.status(500).json({ error: 'Erreur lors de la traduction' })
  }
}

