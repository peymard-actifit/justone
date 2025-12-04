import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, Upload, Sparkles } from 'lucide-react'

const ADMIN_CODE = '12411241'

export default function Home() {
  const navigate = useNavigate()
  const [hasCV, setHasCV] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleChoice = (choice: 'yes' | 'no') => {
    if (choice === 'yes') {
      setHasCV(true)
    } else {
      // Partir de zéro - rediriger vers login/register
      navigate('/login')
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    
    // TODO: Upload vers API et analyse IA
    // Pour l'instant, redirection vers l'éditeur
    setTimeout(() => {
      navigate('/dashboard')
      setIsLoading(false)
    }, 1000)
  }

  if (hasCV === null) {
    // Écran de choix initial - le plus simple et épuré possible
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <div className="animated-bg" />
        <div className="grid-bg" />
        
        <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
          <div className="mb-12 animate-fade-in">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mx-auto mb-6">
              <span className="text-white font-bold text-3xl">J1</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Just<span className="text-gradient">1</span>
            </h1>
          </div>

          <div className="space-y-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <p className="text-xl text-dark-300 mb-12">
              Avez-vous un CV ou souhaitez-vous partir de zéro ?
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => handleChoice('yes')}
                className="btn btn-primary text-lg px-8 py-4"
              >
                <Upload className="w-5 h-5" />
                J'ai un CV
              </button>
              
              <button
                onClick={() => handleChoice('no')}
                className="btn btn-secondary text-lg px-8 py-4"
              >
                <FileText className="w-5 h-5" />
                Partir de zéro
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Écran d'import de fichier
  return (
    <div className="min-h-screen relative flex items-center justify-center px-6">
      <div className="animated-bg" />
      <div className="grid-bg" />
      
      <div className="relative z-10 w-full max-w-md">
        <div className="card animate-scale-in">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Importer votre CV</h2>
            <p className="text-dark-400 text-sm">
              Formats supportés : PDF, Word, LaTeX, Excel, PowerPoint
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="cv-name" className="block text-sm font-medium mb-2">
                Nom du fichier
              </label>
              <input
                type="text"
                id="cv-name"
                placeholder="Ex: CV_Patrick_Eymard_2025"
                className="w-full px-4 py-3 bg-dark-800/50 border border-white/10 rounded-xl text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Sélectionner le fichier
              </label>
              <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-primary-500/50 transition-colors">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.tex,.xlsx,.pptx"
                  onChange={handleFileUpload}
                  disabled={isLoading}
                  className="hidden"
                  id="file-input"
                />
                <label
                  htmlFor="file-input"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <Upload className="w-8 h-8 text-dark-400" />
                  <span className="text-dark-400 text-sm">
                    Cliquez pour sélectionner ou glissez-déposez
                  </span>
                </label>
              </div>
            </div>

            {isLoading && (
              <div className="flex items-center justify-center gap-2 text-primary-400">
                <Sparkles className="w-5 h-5 animate-spin" />
                <span>Analyse en cours par IA...</span>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setHasCV(null)}
                className="btn btn-ghost flex-1"
              >
                Retour
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
