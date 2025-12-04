import { useState } from 'react'
import NavigationBar from '../components/NavigationBar'
import { Sparkles, FileText, Briefcase, Globe, Search, MessageSquare } from 'lucide-react'

interface AIFeature {
  id: string
  title: string
  description: string
  icon: typeof Sparkles
  category: string
}

const aiFeatures: AIFeature[] = [
  {
    id: 'adapt-offer',
    title: 'Adapter à une offre d\'emploi',
    description: 'Créez un CV optimisé pour une offre spécifique',
    icon: Briefcase,
    category: 'CV',
  },
  {
    id: 'optimize-ai',
    title: 'Optimiser pour les IA',
    description: 'CV avec mots-clés pour les systèmes de recrutement IA',
    icon: Sparkles,
    category: 'CV',
  },
  {
    id: 'improve-content',
    title: 'Améliorer le contenu',
    description: 'Propositions de formulations plus pertinentes',
    icon: MessageSquare,
    category: 'Contenu',
  },
  {
    id: 'from-example',
    title: 'Créer depuis un exemple',
    description: 'Générer un CV basé sur un format donné',
    icon: FileText,
    category: 'CV',
  },
  {
    id: 'business-card',
    title: 'Carte de visite',
    description: 'Créer des cartes (A4, A5, A6)',
    icon: FileText,
    category: 'Autre',
  },
  {
    id: 'spontaneous',
    title: 'Candidature spontanée',
    description: 'CV pour entreprises connues sur Internet',
    icon: Globe,
    category: 'CV',
  },
  {
    id: 'find-jobs',
    title: 'Rechercher des offres',
    description: 'Trouver des offres correspondant à votre profil',
    icon: Search,
    category: 'Recherche',
  },
  {
    id: 'find-profiles',
    title: 'Rechercher des profils',
    description: 'Trouver des profils équivalents sur Internet',
    icon: Search,
    category: 'Recherche',
  },
]

export default function AIPage() {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null)

  return (
    <div className="min-h-screen relative">
      <div className="animated-bg" />
      <div className="grid-bg" />

      <NavigationBar />

      <main className="relative z-10 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Assistant <span className="text-gradient">IA</span>
            </h1>
            <p className="text-dark-400">
              Utilisez l'intelligence artificielle pour améliorer et créer vos CVs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {aiFeatures.map((feature) => {
              const Icon = feature.icon
              return (
                <button
                  key={feature.id}
                  onClick={() => setSelectedFeature(feature.id)}
                  className="card-hover text-left group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-500/20 transition-colors">
                      <Icon className="w-6 h-6 text-primary-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{feature.title}</h3>
                      <p className="text-dark-400 text-sm">{feature.description}</p>
                      <span className="inline-block mt-2 px-2 py-0.5 bg-dark-700 text-dark-300 text-xs rounded">
                        {feature.category}
                      </span>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {selectedFeature && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <div className="card w-full max-w-2xl animate-scale-in">
                <h2 className="text-xl font-bold mb-4">
                  {aiFeatures.find(f => f.id === selectedFeature)?.title}
                </h2>
                <p className="text-dark-400 mb-6">
                  {aiFeatures.find(f => f.id === selectedFeature)?.description}
                </p>
                <div className="p-4 bg-dark-800/50 rounded-lg mb-4">
                  <p className="text-sm text-dark-400">
                    Cette fonctionnalité nécessite la configuration de l'API IA.
                    <br />
                    Veuillez fournir les clés API dans les paramètres.
                  </p>
                </div>
                <button
                  onClick={() => setSelectedFeature(null)}
                  className="btn btn-primary"
                >
                  Fermer
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

