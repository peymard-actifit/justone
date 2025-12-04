import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit, Globe, Tag, Save } from 'lucide-react'
import type { DataField, FieldType, FieldValue } from '../types/database'
import TranslateButton from './TranslateButton'

interface DataEditorProps {
  fields: DataField[]
  baseLanguage: string
  onSave: (fields: DataField[]) => void
  onAddField: (field: DataField) => void
  onDeleteField: (fieldId: string) => void
}

export default function DataEditor({
  fields,
  baseLanguage,
  onSave,
  onAddField,
  onDeleteField,
}: DataEditorProps) {
  const [localFields, setLocalFields] = useState<DataField[]>(fields)
  const [editingField, setEditingField] = useState<string | null>(null)
  const [showAddField, setShowAddField] = useState(false)

  useEffect(() => {
    setLocalFields(fields)
  }, [fields])

  const addNewField = () => {
    const newField: DataField = {
      id: Date.now().toString(),
      tag: '',
      name: '',
      type: 'text',
      baseLanguage,
      values: [{
        language: baseLanguage,
        value: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setLocalFields([...localFields, newField])
    setEditingField(newField.id)
    setShowAddField(false)
  }

  const updateField = (fieldId: string, updates: Partial<DataField>) => {
    setLocalFields(localFields.map(f => 
      f.id === fieldId ? { ...f, ...updates, updatedAt: new Date().toISOString() } : f
    ))
  }

  const addLanguage = (fieldId: string, language: string) => {
    const field = localFields.find(f => f.id === fieldId)
    if (!field) return

    const newValue: FieldValue = {
      language,
      value: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    updateField(fieldId, {
      values: [...field.values, newValue],
    })
  }

  const updateFieldValue = (fieldId: string, language: string, value: string | number) => {
    const field = localFields.find(f => f.id === fieldId)
    if (!field) return

    const updatedValues = field.values.map(v =>
      v.language === language
        ? { ...v, value, updatedAt: new Date().toISOString() }
        : v
    )

    updateField(fieldId, { values: updatedValues })
  }

  const handleSave = () => {
    onSave(localFields)
  }

  const fieldTypes: { value: FieldType; label: string }[] = [
    { value: 'text', label: 'Texte' },
    { value: 'number', label: 'Nombre' },
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Téléphone' },
    { value: 'url', label: 'URL' },
    { value: 'date', label: 'Date' },
    { value: 'image', label: 'Image' },
    { value: 'video', label: 'Vidéo' },
    { value: 'rich-text', label: 'Texte enrichi' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Éditeur de données</h2>
          <p className="text-dark-400 text-sm">
            Gérez vos données personnelles et leurs traductions
          </p>
        </div>
        <div className="flex gap-3">
          <TranslateButton
            onTranslate={async (lang) => {
              const user = JSON.parse(localStorage.getItem('user') || '{}')
              const res = await fetch('/api/translate/auto', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'x-user-id': user.id,
                },
                body: JSON.stringify({
                  translateAll: true,
                  targetLanguage: lang,
                }),
              })
              if (res.ok) {
                const data = await res.json()
                setLocalFields(data.profile.fields)
                alert(`Tous les champs traduits en ${lang}`)
              }
            }}
            availableLanguages={Array.from(new Set(localFields.flatMap(f => f.values.map(v => v.language))))}
          />
          <button
            onClick={() => setShowAddField(true)}
            className="btn btn-secondary"
          >
            <Plus className="w-4 h-4" />
            Ajouter un champ
          </button>
          <button onClick={handleSave} className="btn btn-primary">
            <Save className="w-4 h-4" />
            Sauvegarder
          </button>
        </div>
      </div>

      {/* Fields List */}
      <div className="space-y-4">
        {localFields.map((field) => (
          <div key={field.id} className="card">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                {editingField === field.id ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium mb-1">
                          Tag (unique)
                        </label>
                        <input
                          type="text"
                          value={field.tag}
                          onChange={(e) => updateField(field.id, { tag: e.target.value })}
                          placeholder="ex: nom, prenom, email"
                          className="w-full px-3 py-2 bg-dark-800/50 border border-white/10 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">
                          Type
                        </label>
                        <select
                          value={field.type}
                          onChange={(e) => updateField(field.id, { type: e.target.value as FieldType })}
                          className="w-full px-3 py-2 bg-dark-800/50 border border-white/10 rounded-lg text-sm"
                        >
                          {fieldTypes.map(t => (
                            <option key={t.value} value={t.value}>{t.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">
                        Nom du champ
                      </label>
                      <input
                        type="text"
                        value={field.name}
                        onChange={(e) => updateField(field.id, { name: e.target.value })}
                        placeholder="Ex: Nom, Prénom, Email"
                        className="w-full px-3 py-2 bg-dark-800/50 border border-white/10 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{field.name || 'Sans nom'}</span>
                      <span className="px-2 py-0.5 bg-primary-500/10 text-primary-400 text-xs rounded">
                        <Tag className="w-3 h-3 inline mr-1" />
                        {field.tag || 'sans tag'}
                      </span>
                      <span className="px-2 py-0.5 bg-dark-700 text-dark-300 text-xs rounded">
                        {field.type}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingField(editingField === field.id ? null : field.id)}
                  className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteField(field.id)}
                  className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500/20"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Values by language */}
            <div className="space-y-2">
              {field.values.map((value) => (
                <div key={value.language} className="flex items-center gap-2">
                  <span className="w-16 text-xs text-dark-400 uppercase flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    {value.language}
                  </span>
                  <input
                    type={field.type === 'number' ? 'number' : 'text'}
                    value={value.value || ''}
                    onChange={(e) => updateFieldValue(field.id, value.language, e.target.value)}
                    placeholder={`Valeur en ${value.language}`}
                    className="flex-1 px-3 py-2 bg-dark-800/50 border border-white/10 rounded-lg text-sm"
                  />
                </div>
              ))}
              
              {/* Translate and Add language buttons */}
              <div className="flex items-center gap-2 pt-2">
                <TranslateButton
                  fieldId={field.id}
                  onTranslate={async (lang) => {
                    const user = JSON.parse(localStorage.getItem('user') || '{}')
                    const res = await fetch('/api/translate/auto', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'x-user-id': user.id,
                      },
                      body: JSON.stringify({
                        fieldId: field.id,
                        targetLanguage: lang,
                      }),
                    })
                    if (res.ok) {
                      const data = await res.json()
                      // Mettre à jour le champ traduit
                      setLocalFields(localFields.map(f => 
                        f.id === field.id ? data.field : f
                      ))
                    }
                  }}
                  availableLanguages={field.values.map(v => v.language)}
                />
                <button
                  onClick={() => {
                    const lang = prompt('Code langue (ex: en, es, de) :')
                    if (lang) addLanguage(field.id, lang)
                  }}
                  className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1 px-2 py-1 rounded hover:bg-white/5"
                >
                  <Plus className="w-3 h-3" />
                  Ajouter une langue
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {localFields.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-dark-400 mb-4">Aucun champ de données</p>
          <button onClick={addNewField} className="btn btn-secondary">
            <Plus className="w-4 h-4" />
            Créer votre premier champ
          </button>
        </div>
      )}

      {/* Add field modal */}
      {showAddField && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="card w-full max-w-md animate-scale-in">
            <h3 className="text-lg font-bold mb-4">Ajouter un nouveau champ</h3>
            <div className="space-y-4">
              <p className="text-dark-400 text-sm">
                Un nouveau champ sera créé avec la langue de base ({baseLanguage})
              </p>
              <div className="flex gap-3">
                <button onClick={addNewField} className="btn btn-primary flex-1">
                  Créer
                </button>
                <button onClick={() => setShowAddField(false)} className="btn btn-ghost">
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

