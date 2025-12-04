import { useState } from 'react'
import { Languages, Loader2 } from 'lucide-react'

interface TranslateButtonProps {
  fieldId?: string
  onTranslate: (language: string) => Promise<void>
  availableLanguages?: string[]
}

const commonLanguages = [
  { code: 'en', name: 'Anglais' },
  { code: 'es', name: 'Espagnol' },
  { code: 'de', name: 'Allemand' },
  { code: 'it', name: 'Italien' },
  { code: 'pt', name: 'Portugais' },
  { code: 'nl', name: 'Néerlandais' },
  { code: 'pl', name: 'Polonais' },
  { code: 'ru', name: 'Russe' },
  { code: 'ja', name: 'Japonais' },
  { code: 'zh', name: 'Chinois' },
]

export default function TranslateButton({ fieldId, onTranslate, availableLanguages = [] }: TranslateButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isTranslating, setIsTranslating] = useState(false)
  const [selectedLang, setSelectedLang] = useState<string | null>(null)

  const handleTranslate = async (langCode: string) => {
    setIsTranslating(true)
    setSelectedLang(langCode)
    try {
      await onTranslate(langCode)
      setIsOpen(false)
    } catch (error) {
      console.error('Translation error:', error)
      alert('Erreur lors de la traduction')
    } finally {
      setIsTranslating(false)
      setSelectedLang(null)
    }
  }

  const translateAll = async (langCode: string) => {
    setIsTranslating(true)
    setSelectedLang(langCode)
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      const res = await fetch('/api/translate/auto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id,
        },
        body: JSON.stringify({
          translateAll: true,
          targetLanguage: langCode,
        }),
      })

      if (!res.ok) {
        throw new Error('Erreur de traduction')
      }

      alert(`Tous les champs ont été traduits en ${commonLanguages.find(l => l.code === langCode)?.name || langCode}`)
      setIsOpen(false)
      window.location.reload() // Recharger pour voir les traductions
    } catch (error) {
      console.error('Translation error:', error)
      alert('Erreur lors de la traduction')
    } finally {
      setIsTranslating(false)
      setSelectedLang(null)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isTranslating}
        className="btn btn-secondary text-sm"
      >
        {isTranslating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Traduction...
          </>
        ) : (
          <>
            <Languages className="w-4 h-4" />
            {fieldId ? 'Traduire' : 'Traduire tout'}
          </>
        )}
      </button>

      {isOpen && !isTranslating && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full right-0 mt-2 w-56 card py-2 z-20 animate-scale-in">
            <div className="px-3 py-2 border-b border-white/10 mb-2">
              <p className="text-xs font-medium text-dark-400">
                {fieldId ? 'Traduire ce champ' : 'Traduire tous les champs'}
              </p>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {commonLanguages.map((lang) => {
                const isTranslated = availableLanguages.includes(lang.code)
                return (
                  <button
                    key={lang.code}
                    onClick={() => fieldId ? handleTranslate(lang.code) : translateAll(lang.code)}
                    disabled={selectedLang === lang.code}
                    className={`
                      w-full px-3 py-2 text-left text-sm hover:bg-white/5 transition-colors
                      ${isTranslated ? 'opacity-60' : ''}
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <span>{lang.name}</span>
                      {isTranslated && (
                        <span className="text-xs text-green-400">✓</span>
                      )}
                      {selectedLang === lang.code && (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

