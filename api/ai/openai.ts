import type { VercelRequest, VercelResponse } from '@vercel/node'

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || ''
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'

// Fonction utilitaire pour appeler OpenAI
export async function callOpenAI(
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  model: string = 'gpt-4o-mini',
  temperature: number = 0.7
): Promise<string> {
  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('OpenAI API error:', error)
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    return data.choices[0]?.message?.content || ''
  } catch (error) {
    console.error('OpenAI call error:', error)
    throw error
  }
}

// POST - Endpoint générique pour les requêtes OpenAI
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const userId = req.headers['x-user-id'] as string
  if (!userId) {
    return res.status(401).json({ error: 'Non autorisé' })
  }

  try {
    const { messages, model, temperature, action } = req.body

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages requis' })
    }

    const response = await callOpenAI(messages, model, temperature)

    return res.status(200).json({
      success: true,
      response,
      action,
    })
  } catch (error) {
    console.error('OpenAI handler error:', error)
    return res.status(500).json({
      error: 'Erreur lors de l\'appel à OpenAI',
      details: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
