import { useState } from 'react'
import NavigationBar from '../components/NavigationBar'
import { FileText, Filter, Plus, Search } from 'lucide-react'
import type { CVFormat } from '../types/database'

export default function FormatsPage() {
  const [formats, setFormats] = useState<CVFormat[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    country: '',
    targetAudience: '',
  })

  // TODO: Charger depuis l'API
  const mockFormats: CVFormat[] = [
    {
      id: '1',
      name: 'CV Français Standard',
      description: 'Format classique français',
      tags: ['nom', 'prenom', 'email', 'telephone', 'experiences', 'formations'],
      metadata: {
        country: ['FR'],
        targetAudience: ['entreprise'],
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]

  return (
    <div className="min-h-screen relative">
      <div className="animated-bg" />
      <div className="grid-bg" />

      <NavigationBar />

      <main className="relative z-10 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Formats de CV</h1>
              <p className="text-dark-400">
                Choisissez un format et mappez vos données
              </p>
            </div>
            <button className="btn btn-primary">
              <Plus className="w-4 h-4" />
              Nouveau format (Admin)
            </button>
          </div>

          {/* Filters */}
          <div className="card mb-6">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                  <input
                    type="text"
                    placeholder="Rechercher un format..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-dark-800/50 border border-white/10 rounded-lg text-sm"
                  />
                </div>
              </div>
              <select
                value={filters.country}
                onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                className="px-4 py-2 bg-dark-800/50 border border-white/10 rounded-lg text-sm"
              >
                <option value="">Tous les pays</option>
                <option value="FR">France</option>
                <option value="EN">International</option>
              </select>
              <select
                value={filters.targetAudience}
                onChange={(e) => setFilters({ ...filters, targetAudience: e.target.value })}
                className="px-4 py-2 bg-dark-800/50 border border-white/10 rounded-lg text-sm"
              >
                <option value="">Tous les destinataires</option>
                <option value="esn">ESN</option>
                <option value="entreprise">Entreprise</option>
              </select>
            </div>
          </div>

          {/* Formats list */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockFormats.map((format) => (
              <div key={format.id} className="card-hover">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{format.name}</h3>
                    {format.description && (
                      <p className="text-dark-400 text-sm mb-2">{format.description}</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-xs text-dark-400">
                    Tags requis: {format.tags.length}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {format.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-dark-700 text-dark-300 text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    {format.tags.length > 3 && (
                      <span className="px-2 py-0.5 text-dark-500 text-xs">
                        +{format.tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                <button className="btn btn-primary w-full mt-4">
                  Utiliser ce format
                </button>
              </div>
            ))}
          </div>

          {mockFormats.length === 0 && (
            <div className="card text-center py-12">
              <FileText className="w-16 h-16 text-dark-600 mx-auto mb-4" />
              <p className="text-dark-400 mb-2">Aucun format disponible</p>
              <p className="text-dark-500 text-sm">
                Les administrateurs peuvent ajouter des formats de CV
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

