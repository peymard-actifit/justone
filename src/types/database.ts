// Types pour la base de données flexible Just1

export type FieldType = 'text' | 'number' | 'image' | 'video' | 'date' | 'url' | 'email' | 'phone' | 'rich-text'

export interface FieldValue {
  language: string // Code langue (fr, en, es, etc.)
  value: string | number | null
  aiVersions?: string[] // Jusqu'à 3 versions générées par IA
  createdAt: string
  updatedAt: string
}

export interface DataField {
  id: string
  tag: string // Tag unique pour le mapping avec les formats de CV
  name: string // Nom affiché (dans la langue de base)
  type: FieldType
  baseLanguage: string // Langue de base de l'utilisateur
  values: FieldValue[] // Toutes les traductions/valeurs
  metadata?: {
    category?: string
    required?: boolean
    order?: number
    [key: string]: any
  }
  createdAt: string
  updatedAt: string
}

export interface UserProfile {
  id: string
  userId: string
  baseLanguage: string // Langue principale de l'utilisateur
  fields: DataField[] // Tous les champs de données
  tags: string[] // Tags personnalisés de l'utilisateur
  metadata: {
    adminMode?: boolean
    adminCode?: string // Code admin : 12411241
    [key: string]: any
  }
  createdAt: string
  updatedAt: string
}

export interface CVFormat {
  id: string
  name: string
  description?: string
  templateFile?: string // URL ou référence au template
  tags: string[] // Tags requis pour ce format
  metadata: {
    country?: string[]
    targetAudience?: string[] // 'esn', 'entreprise', etc.
    category?: string
    [key: string]: any
  }
  createdBy?: string // Admin uniquement
  createdAt: string
  updatedAt: string
}

export interface CVExport {
  id: string
  userId: string
  formatId: string
  fieldMappings: Record<string, string> // tag du format -> id du champ utilisateur
  customData?: Record<string, any> // Données personnalisées pour ce CV
  language: string
  createdAt: string
}

