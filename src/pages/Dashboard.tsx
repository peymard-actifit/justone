import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Plus, Upload, FileText, Trash2, Edit, LogOut, Settings, MoreVertical, Globe, Calendar 
} from 'lucide-react'

interface CV {
  id: string
  name: string
  language: string
  createdAt: string
  updatedAt: string
}

interface User {
  id: string
  username: string
  fullName: string
  email: string
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [cvs, setCvs] = useState<CV[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showNewCVModal, setShowNewCVModal] = useState(false)
  const [newCVName, setNewCVName] = useState('')
  const [newCVLang, setNewCVLang] = useState('fr')
  const [activeMenu, setActiveMenu] = useState<string | null>(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      navigate('/login')
      return
    }
    
    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    loadCVs(parsedUser.id)
  }, [navigate])

  const loadCVs = async (userId: string) => {
    try {
      const res = await fetch('/api/cv', {
        headers: { 'x-user-id': userId },
      })
      const data = await res.json()
      setCvs(data.cvs || [])
    } catch (error) {
      console.error('Error loading CVs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const createNewCV = async () => {
    if (!newCVName.trim() || !user) return

    try {
      const res = await fetch('/api/cv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id,
        },
        body: JSON.stringify({
          name: newCVName,
          language: newCVLang,
        }),
      })

      const data = await res.json()
      if (data.success) {
        setCvs([data.cv, ...cvs])
        setShowNewCVModal(false)
        setNewCVName('')
        navigate(`/cv/${data.cv.id}/edit`)
      }
    } catch (error) {
      console.error('Error creating CV:', error)
    }
  }

  const deleteCV = async (cvId: string) => {
    if (!user || !confirm('Êtes-vous sûr de vouloir supprimer ce CV ?')) return

    try {
      await fetch(`/api/cv/${cvId}`, {
        method: 'DELETE',
        headers: { 'x-user-id': user.id },
      })
      setCvs(cvs.filter(cv => cv.id !== cvId))
    } catch (error) {
      console.error('Error deleting CV:', error)
    }
  }

  const logout = () => {
    localStorage.removeItem('user')
    navigate('/')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const languageLabels: Record<string, string> = {
    fr: 'Français', en: 'Anglais', es: 'Espagnol', de: 'Allemand', it: 'Italien', pt: 'Portugais'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      {/* Header */}
      <header className="relative z-10 px-6 py-4 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">J1</span>
            </div>
            <span className="text-xl font-bold">Just<span className="text-gradient">1</span></span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="font-medium">{user?.fullName}</p>
              <p className="text-sm text-dark-400">{user?.username}</p>
            </div>
            <button
              onClick={() => setActiveMenu(activeMenu === 'user' ? null : 'user')}
              className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors relative"
            >
              <Settings className="w-5 h-5" />
              {activeMenu === 'user' && (
                <div className="absolute top-full right-0 mt-2 w-48 card py-2 animate-scale-in">
                  <button
                    onClick={logout}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-white/5 flex items-center gap-2 text-red-400"
                  >
                    <LogOut className="w-4 h-4" />
                    Déconnexion
                  </button>
                </div>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Bienvenue, <span className="text-gradient">{user?.fullName.split(' ')[0]}</span>
            </h1>
            <p className="text-dark-400">Gérez vos différentes versions de CV depuis cet espace</p>
          </div>

          <div className="flex flex-wrap gap-4 mb-8">
            <button onClick={() => setShowNewCVModal(true)} className="btn btn-primary">
              <Plus className="w-5 h-5" />
              Nouveau CV
            </button>
            <button className="btn btn-secondary opacity-50 cursor-not-allowed">
              <Upload className="w-5 h-5" />
              Importer (bientôt)
            </button>
          </div>

          <h2 className="text-xl font-semibold mb-4">Mes CV</h2>

          {cvs.length === 0 ? (
            <div className="card text-center py-16">
              <FileText className="w-16 h-16 text-dark-600 mx-auto mb-4" />
              <p className="text-dark-400 mb-2">Aucun CV enregistré</p>
              <p className="text-dark-500 text-sm">Créez votre premier CV</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cvs.map((cv) => (
                <div key={cv.id} className="card-hover group relative">
                  <Link to={`/cv/${cv.id}/edit`} className="block">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-6 h-6 text-primary-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate pr-8">{cv.name}</h3>
                        <div className="flex items-center gap-3 mt-2 text-sm text-dark-400">
                          <span className="flex items-center gap-1">
                            <Globe className="w-3.5 h-3.5" />
                            {languageLabels[cv.language] || cv.language}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(cv.updatedAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>

                  <button
                    onClick={(e) => { e.preventDefault(); setActiveMenu(activeMenu === cv.id ? null : cv.id) }}
                    className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {activeMenu === cv.id && (
                    <div className="absolute top-12 right-4 w-40 card py-2 z-20 animate-scale-in">
                      <Link to={`/cv/${cv.id}/edit`} className="w-full px-3 py-2 text-left text-sm hover:bg-white/5 flex items-center gap-2">
                        <Edit className="w-4 h-4" /> Modifier
                      </Link>
                      <div className="border-t border-white/10 my-1" />
                      <button
                        onClick={() => deleteCV(cv.id)}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-white/5 flex items-center gap-2 text-red-400"
                      >
                        <Trash2 className="w-4 h-4" /> Supprimer
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {showNewCVModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowNewCVModal(false)} />
          <div className="card w-full max-w-md relative z-10 animate-scale-in">
            <h2 className="text-xl font-bold mb-6">Créer un nouveau CV</h2>
            <div className="space-y-4 mb-6">
              <div>
                <label htmlFor="cv-name">Nom du CV</label>
                <input
                  type="text"
                  id="cv-name"
                  placeholder="Ex: CV Français - Version Longue"
                  value={newCVName}
                  onChange={(e) => setNewCVName(e.target.value)}
                  autoFocus
                />
              </div>
              <div>
                <label htmlFor="cv-lang">Langue</label>
                <select id="cv-lang" value={newCVLang} onChange={(e) => setNewCVLang(e.target.value)}>
                  <option value="fr">Français</option>
                  <option value="en">Anglais</option>
                  <option value="es">Espagnol</option>
                  <option value="de">Allemand</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowNewCVModal(false)} className="btn btn-ghost">Annuler</button>
              <button onClick={createNewCV} disabled={!newCVName.trim()} className="btn btn-primary">Créer le CV</button>
            </div>
          </div>
        </div>
      )}

      {activeMenu && <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)} />}
    </div>
  )
}

